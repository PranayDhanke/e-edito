export const logService = {
  async getLogs(token: string, roomCode: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/logs/${roomCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch room activity");
    }

    return response.json();
  },
};
