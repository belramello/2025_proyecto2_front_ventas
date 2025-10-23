export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  logo: string; // Esto será el nombre del archivo (ej: "1761156544098.webp")
  deletedAt: Date | null;
  productosAsociados: number;
}

// Interfaz para la respuesta paginada
export interface MarcasPaginatedResponse {
  marcas: Marca[];
  total: number;
  page: number;
  lastPage: number;
}