import type { Permiso } from "./permisoInterface";

export interface Rol {
  id: number;
  nombre: "VENDEDOR" | "ADMINISTRADOR" | "DUEÑO";
  modificable: boolean;
  descripcion: string;
  permisos: Permiso[];
}
