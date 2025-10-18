export interface Rol {
  id: number;
  nombre: "Vendedor" | "Administrador" | "Dueño";
  modificable: boolean;
  descripcion: string;
  permisos: number[];
}
