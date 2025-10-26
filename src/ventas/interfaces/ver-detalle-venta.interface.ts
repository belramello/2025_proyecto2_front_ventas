import type { DetalleVenta } from "./detalle-venta.interface";

export interface VerDetalleVentaResponse {
  id: number;
  total: number;
  medioDePago: string;
  detalles: DetalleVenta[];
  vendedor: string;
  fecha: string;
}
