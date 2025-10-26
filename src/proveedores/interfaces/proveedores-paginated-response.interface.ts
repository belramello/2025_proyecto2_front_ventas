import type { Proveedor } from "./proveedores-interface";

export interface ProveedorPaginatedResponse {
  proveedores: Proveedor[];
  total: number;
  page: number;
  lastPage: number;
}
