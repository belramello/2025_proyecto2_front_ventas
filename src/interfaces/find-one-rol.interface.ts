import type { Permiso } from "./permiso-interface";

export interface RespuestaFindOneRol {
  id: number;
  nombre: "Vendedor" | "Administrador" | "Dueño";
  modificable: boolean;
  descripcion: string;
  permisos: Permiso[];
}
