import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const loginRequest = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return data; // { access_token, refresh_token, user }
  } catch (error) {
    throw error || { message: "Error de conexión" };
  }
};
