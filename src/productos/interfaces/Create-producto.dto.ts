export interface CreateProductoDto {
  nombre: string;
  descripcion: string;
  precio: number;
  codigo: string;
  imagen?: File | null;
  marcaId: number;
  lineaId: number;
  stock:number;
}
