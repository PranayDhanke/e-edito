export interface ExecutionResponse {
  jobId: string;
  roomCode: string;
  language: string;
  status: "completed" | "failed" | "timeout";
  exitCode: number | null;
  durationMs: number;
  output: Array<{
    type: "stdout" | "stderr" | "system" | "success" | "error";
    message: string;
    timestamp: string;
  }>;
}

export const executionService = {
  async runCode(
    token: string,
    data: {
      room_code: string;
      language: string;
      code: string;
    },
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to run code");
    }

    return payload.data as ExecutionResponse;
  },
};
