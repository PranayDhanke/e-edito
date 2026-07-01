export const participantService = {
  async getParticipants(token: string, roomCode: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/participants`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return response.json(); 
  },

  async removeParticipant(token: string, roomCode: string, userId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/participant/${userId}/remove`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.log(response);
      throw new Error(payload?.message || "Failed to remove participant");
      
    }

    return payload;
  },

  async banParticipant(
    token: string,
    roomCode: string,
    userId: string,
    data: {
      reason: string;
      notes?: string | null;
    },
  ) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/participant/${userId}/ban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to ban participant");
    }

    return payload;
  },
};
