import type { Permiso } from "./permisoInterface";

export interface Rol {
  id: number;
  nombre: "Vendedor" | "Administrador" | "Auditor de Seguridad";
  modificable: boolean;
  descripcion: string;
  permisos: Permiso[];
}
