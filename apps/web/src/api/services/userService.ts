//creating a service for the user auth api

export const userService = {
  async getMe(token: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
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

  async getUser(token: string, userId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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
};
