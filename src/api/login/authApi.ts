import axios from "axios";
import type { LoginCredentials } from "./interfaces/login-credentials.interface";
import type { LoginResponse } from "./interfaces/login-response.interface";

const API_URL = "http://localhost:3000/auth";

export const loginRequest = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error durante el login:", error);
    throw error;
  }
};
