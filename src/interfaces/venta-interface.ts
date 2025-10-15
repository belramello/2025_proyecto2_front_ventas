import type { MedioDePago } from "../types/MedioDePagoType";

export interface Venta {
  id: number;
  fecha: string;
  hora: string;
  total: string;
  pago: string;
  vendedor: string;
  medioDePago: MedioDePago;
}
