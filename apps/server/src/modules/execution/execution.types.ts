import { ExecuteCodeInput } from "@repo/validation";

export type ExecutionLineType =
  | "stdout"
  | "stderr"
  | "system"
  | "success"
  | "error";

export interface ExecutionOutputLine {
  type: ExecutionLineType;
  message: string;
  timestamp: string;
}

export interface ExecutionResult {
  jobId: string;
  roomCode: string;
  language: ExecuteCodeInput["language"];
  status: "completed" | "failed" | "timeout";
  exitCode: number | null;
  durationMs: number;
  output: ExecutionOutputLine[];
}
