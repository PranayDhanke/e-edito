import { CreateRoomFormInput } from "@repo/validation";
import { RoomFilters } from "@repo/shared-types";

//creating a service for the room
export const roomService = {
  //add room service
  async addRoom(token: string, data: CreateRoomFormInput) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) { 
      throw new Error("Failed to fetch current user");
    }

    return response.json();
  },

  //get room service
  async getRoom(token: string, roomCode: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch room please try again from the links");
    }

    return response.json();
  },

  //get my rooms service
  async getMyRoom(token: string, filters?: RoomFilters) {
    const query = new URLSearchParams();

    if (filters?.cursor) {
      query.set("cursor", filters.cursor);
    }

    if (filters?.limit) {
      query.set("limit", String(filters.limit));
    }

    if (filters?.search?.trim()) {
      query.set("search", filters.search.trim());
    }

    if (filters?.status && filters.status !== "all") {
      query.set("status", filters.status);
    }

    if (filters?.language && filters.language !== "all") {
      query.set("language", filters.language);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms${query.toString() ? `?${query.toString()}` : ""}`,
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

  //join room service
  async joinRoom(
    token: string,
    roomCode: string,
    role: string,
    invitedBy: string,
  ) {
    const query = new URLSearchParams();

    query.set("role", role);
    query.set("invited_by", invitedBy);

    const queryString = query.toString();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/join${queryString ? `?${queryString}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to join room");
    }

    return payload;
  },

  //join room service
  async leaveRoom(token: string, roomCode: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/leave`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to leave room");
    }

    return payload;
  },
};
