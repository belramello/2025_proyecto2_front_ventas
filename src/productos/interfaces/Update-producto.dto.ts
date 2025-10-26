export interface UpdateProductoDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  codigo?: string;
  imagen?: File;
  marcaId?: number;
  lineaId?: number;
  stock?: number;
}