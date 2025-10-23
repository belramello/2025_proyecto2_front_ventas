import type { HistorialPaginatedResponse } from "../auditoria/interfaces/HisotorialPaginatedResponse.dto";
import api from "../utils/api";

export const AuditoriaService = {
async getHistorial(page: number = 1): Promise<HistorialPaginatedResponse> {
    try {
      const { data } = await api.get<HistorialPaginatedResponse>(
        `/historial-actividades?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      throw error;
    }
  }
};
