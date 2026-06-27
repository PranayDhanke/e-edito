export const versionService = {
    async getVersions(token: string, roomCode: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/versions/${roomCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch room versions");
    }

    return response.json();
  },

}