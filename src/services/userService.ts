import axios from "@/plugins/axios";

export const userService = {
  async createUser(username: string, password: string) {
    const response = await axios.post("/users", {
      username,
      password,
    });
    return response.data;
  },

  async login(username: string, password: string) {
    const response = await axios.post("/login", {
      username,
      password,
    });
    return response.data;
  },

  async updateProfile(
    userId: string,
    profileData: {
      name: string;
      gender: string;
      dateOfBirth: string;
      preference: string;
      profileImage?: string;
    }
  ) {
    const response = await axios.put(`/users/${userId}/profile`, profileData);
    return response.data;
  },

  async updateInterests(userId: string, interests: string[]) {
    const response = await axios.put(`/users/${userId}/interests`, {
      interests,
    });
    return response.data;
  },
};
