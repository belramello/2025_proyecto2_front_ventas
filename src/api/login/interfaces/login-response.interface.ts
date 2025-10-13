export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}