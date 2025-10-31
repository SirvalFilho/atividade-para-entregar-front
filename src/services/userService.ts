import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const userService = {
  async createUser(username: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      username,
      password,
    });
    return response.data;
  },

  async login(username: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/login`, {
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
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/profile`,
      profileData
    );
    return response.data;
  },

  async updateInterests(userId: string, interests: string[]) {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/interests`,
      { interests }
    );
    return response.data;
  },
};
