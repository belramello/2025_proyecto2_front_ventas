import {
  eliminarTokens,
  guardarToken,
  obtenerRefreshToken,
  obtenerToken,
} from "../utils/storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: any) => {
  const token = obtenerToken();
  if (token && config.headers) {
    config.headers["Authorization"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      const refresh_token = obtenerRefreshToken();
      if (refresh_token) {
        try {
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken: refresh_token },
            { headers: { "Content-Type": "application/json" } }
          );
          const { accessToken, refreshToken } = response.data as {
            accessToken: string;
            refreshToken: string;
          };
          guardarToken(accessToken, refreshToken || null);

          if (error.config) {
            error.config.headers = error.config.headers || {};
            error.config.headers["Authorization"] = accessToken;
            return axios(error.config);
          }
        } catch (refreshError) {
          eliminarTokens();
          return Promise.reject(refreshError);
        }
      } else {
        eliminarTokens();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
