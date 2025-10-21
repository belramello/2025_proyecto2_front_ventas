import type { Rol } from "../roles/interfaces/rol-interface";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaHoraCreacion: string;
  rol: Rol;
}
