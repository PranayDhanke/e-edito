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
};
