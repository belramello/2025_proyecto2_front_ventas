import type { Usuario } from "./usuario-interface";

export interface UsuariosPaginatedResponse {
  usuarios: Usuario[];
  total: number;
  page: number;
  lastPage: number;
}
