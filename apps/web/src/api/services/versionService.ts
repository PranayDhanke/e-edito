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
  async createVersion(
    token: string,
    data: {
      room_code: string;
      name: string;
      code: string;
      language: string;
      reason: string;
    },
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/versions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to save version");
    }

    return payload;
  },
  async restoreVersion(token: string, versionId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/versions/${versionId}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to load version");
    }

    return payload;
  },
};
