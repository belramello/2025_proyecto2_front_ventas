import type { DetalleVenta } from "./detalle-venta.interface";

export interface Venta {
  id: number;
  total: number;
  medioDePago: string;
  vendedor: string;
  fecha: string;
  detalles: DetalleVenta[];
}
