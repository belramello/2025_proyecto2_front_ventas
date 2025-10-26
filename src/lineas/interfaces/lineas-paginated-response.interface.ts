import type { Linea } from "./lineas-interface";

export interface LineaPaginatedResponse {
  lineas: Linea[];
  total: number;
  page: number;
  lastPage: number;
}
