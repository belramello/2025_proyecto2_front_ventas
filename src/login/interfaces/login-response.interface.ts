export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    permisos: number[];
  };
}
