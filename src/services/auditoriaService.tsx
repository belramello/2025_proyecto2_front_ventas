// src/services/auditoriaService.ts
import type { HistorialPaginatedResponse } from "../auditoria/interfaces/HisotorialPaginatedResponse.dto";
import api from "../utils/api";

export const AuditoriaService = {
  async getHistorial(
    page: number = 1,
    search: string = "",
    action: string = "",
    limit: number = 10
  ): Promise<HistorialPaginatedResponse> {
    try {
      // Construir la URL con los parámetros de consulta
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        queryParams.append("search", search);
      }
      if (action) {
        queryParams.append("action", action);
      }

      const { data } = await api.get<HistorialPaginatedResponse>(
        `/historial-actividades?${queryParams.toString()}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      throw error;
    }
  },
};