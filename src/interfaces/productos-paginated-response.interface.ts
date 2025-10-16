import type { Producto } from "./producto-interface";

export interface ProductosPaginatedResponse {
  productos: Producto[];
  total: number;
  page: number;
  lastPage: number;
}
