import { cursorFilters } from "@repo/shared-types";

export const logService = {
  async getLogs(token: string, roomCode: string, filters?: cursorFilters) {
    const query = new URLSearchParams();

    if (filters?.cursor) {
      query.set("cursor", filters.cursor);
    }

    if (filters?.limit) {
      query.set("limit", String(filters.limit));
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/logs/${roomCode}${query.toString() ? `?${query.toString()}` : ""}`,
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

  async getUserLogs(token: string, filters?: cursorFilters) {
    const query = new URLSearchParams();

    if (filters?.cursor) {
      query.set("cursor", filters.cursor);
    }

    if (filters?.limit) {
      query.set("limit", String(filters.limit));
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/logs${query.toString() ? `?${query.toString()}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch activity");
    }

    return response.json();
  },
};
