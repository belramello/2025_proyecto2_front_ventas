import type { Historial } from "./HistorialActividades.dto";

export interface HistorialPaginatedResponse {
  data: Historial[];
  total: number;
  page: number;
  lastPage: number;
}
