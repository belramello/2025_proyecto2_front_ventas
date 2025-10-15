import type { Venta } from "./venta-interface";

export interface VentasPaginatedResponse {
  ventas: Venta[];
  total: number;
  page: number;
  lastPage: number;
}
