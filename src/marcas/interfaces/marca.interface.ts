import type { Linea } from "../../lineas/interfaces/lineas-interface";

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string | null;
  logoUrl: string | null; 
  deletedAt?: Date | null;
  productosAsociados?: number; 
  lineas?: Linea[]; // Array de líneas asociadas (el backend debería enviarlo en getMarcaById)
}

// Interfaz para la respuesta paginada
export interface MarcasPaginatedResponse {
  marcas: Marca[];
  total: number;
  page: number;
  lastPage: number;
}