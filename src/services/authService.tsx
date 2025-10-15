import type { LoginResponse } from "../interfaces/login-response.interface";
import type { LoginCredentials } from "../interfaces/login-credentials.interface";
import { eliminarTokens, guardarToken } from "../utils/storage";
import api from "../utils/api";

export const loginRequest = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(`/auth/login`, credentials);
    const { accessToken, refreshToken, usuario } = response.data;
    guardarToken(accessToken, refreshToken, usuario.nombre);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const cerrarSesion = () => {
  try {
    eliminarTokens();
    window.location.href = "login";
  } catch (error) {
    console.error("Error al cerrar sesión");
  }
};
