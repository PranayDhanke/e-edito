import { Job, Worker } from "bullmq";
import { ExecuteCodeInput } from "@repo/validation";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import { spawn } from "child_process";
import { config } from "../../config/config";
import { bullmqConnection } from "../../infrastructure/queue/connection";
import { logger } from "../../lib/logger";
import {
  ExecutionLineType,
  ExecutionOutputLine,
  ExecutionResult,
} from "./execution.types";

const EXECUTION_TIMEOUT_MS = 15_000;

type RunnerDefinition = {
  image: string;
  fileName: string;
  command: string[];
};

const RUNNER_MAP: Record<ExecuteCodeInput["language"], RunnerDefinition> = {
  javascript: {
    image: "node:20-alpine",
    fileName: "main.js",
    command: ["node", "/workspace/main.js"],
  },
  typescript: {
    image: "denoland/deno:2.2.7",
    fileName: "main.ts",
    command: ["deno", "run", "--quiet", "/workspace/main.ts"],
  },
  python: {
    image: "python:3.12-alpine",
    fileName: "main.py",
    command: ["python", "/workspace/main.py"],
  },
  java: {
    image: "eclipse-temurin:21-jdk",
    fileName: "Main.java",
    command: ["sh", "-lc", "javac Main.java && java Main"],
  },
  cpp: {
    image: "gcc:14",
    fileName: "main.cpp",
    command: ["sh", "-lc", "g++ main.cpp -std=c++17 -O2 -o app && ./app"],
  },
};

const createLine = (
  type: ExecutionLineType,
  message: string,
): ExecutionOutputLine => ({
  type,
  message,
  timestamp: new Date().toISOString(),
});

const splitLines = (chunk: string, type: ExecutionLineType) =>
  chunk
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => createLine(type, line));

const runDockerJob = async (
  data: ExecuteCodeInput,
  jobId: string,
): Promise<ExecutionResult> => {
  const startedAt = Date.now();
  const runner = RUNNER_MAP[data.language];
  const tempDir = path.join(os.tmpdir(), `edito-run-${randomUUID()}`);
  const output: ExecutionOutputLine[] = [
    createLine("system", `Preparing ${data.language} container...`),
  ];

  await fs.mkdir(tempDir, { recursive: true });
  await fs.writeFile(path.join(tempDir, runner.fileName), data.code, "utf8");

  const dockerArgs = [
    "run",
    "--rm",
    "--network",
    "none",
    "--memory",
    "256m",
    "--cpus",
    "1",
    "-v",
    `${tempDir}:/workspace`,
    "-w",
    "/workspace",
    runner.image,
    ...runner.command,
  ];

  let status: ExecutionResult["status"] = "completed";
  let exitCode: number | null = null;

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn("docker", dockerArgs, {
        windowsHide: true,
      });

      let settled = false;
      const timeout = setTimeout(() => {
        status = "timeout";
        child.kill();
      }, EXECUTION_TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => {
        output.push(...splitLines(chunk.toString("utf8"), "stdout"));
      });

      child.stderr.on("data", (chunk: Buffer) => {
        output.push(...splitLines(chunk.toString("utf8"), "stderr"));
      });

      child.on("error", (error) => {
        clearTimeout(timeout);
        if (settled) return;
        settled = true;
        reject(error);
      });

      child.on("close", (code) => {
        clearTimeout(timeout);
        if (settled) return;
        settled = true;
        exitCode = code;

        if (status === "timeout") {
          output.push(
            createLine(
              "error",
              `Execution timed out after ${EXECUTION_TIMEOUT_MS / 1000}s.`,
            ),
          );
          resolve();
          return;
        }

        if (code === 0) {
          output.push(createLine("success", "Execution completed."));
          resolve();
          return;
        }

        status = "failed";
        output.push(createLine("error", `Process exited with code ${code}.`));
        resolve();
      });
    });
  } catch (error) {
    status = "failed";
    exitCode = exitCode ?? 1;
    output.push(
      createLine(
        "error",
        error instanceof Error
          ? error.message
          : "Docker execution failed unexpectedly.",
      ),
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  return {
    jobId,
    roomCode: data.room_code,
    language: data.language,
    status,
    exitCode,
    durationMs: Date.now() - startedAt,
    output,
  };
};

const processExecutionJob = async (
  job: Job<ExecuteCodeInput>,
): Promise<ExecutionResult> => {
  return runDockerJob(job.data, String(job.id));
};

export const executionWorker = new Worker(
  `${config.bullmqPrefix}_code-execution`,
  processExecutionJob,
  {
    connection: bullmqConnection,
    concurrency: 2,
  },
);

executionWorker.on("ready", () => {
  logger.info("code execution worker is ready");
});

executionWorker.on("completed", (job) => {
  logger.info({ jobId: job.id, roomCode: job.data.room_code }, "code executed");
});

executionWorker.on("failed", (job, error) => {
  logger.error(
    { jobId: job?.id, roomCode: job?.data.room_code, error: error.message },
    "code execution job failed",
  );
});
