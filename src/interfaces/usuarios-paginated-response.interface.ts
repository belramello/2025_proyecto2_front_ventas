import type { Usuario } from "./usuarioInterface";

export interface UsuariosPaginatedResponse {
  usuarios: Usuario[];
  total: number;
  page: number;
  lastPage: number;
}
