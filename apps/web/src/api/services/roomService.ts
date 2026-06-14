import { CreateRoomFormInput } from "@repo/validation";

//creating a service for the room
export const roomService = {
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
      throw new Error("Failed to fetch current user");
    }

    return response.json();
  },

  async getMyRoom(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return response.json();
  },

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
