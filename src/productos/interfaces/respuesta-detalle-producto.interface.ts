import type { DetalleProveedorSimplificado } from "./detalle-producto.interface";

export interface DetalleProductoResponse {
  id: number;
  detalles: DetalleProveedorSimplificado[];
}