import type { VentasPaginatedResponse } from "../interfaces/ventas-paginated-response.interface";
import api from "../utils/api";

export const VentasService = {
  async getVentas(page: number = 1): Promise<VentasPaginatedResponse> {
    try {
      const { data } = await api.get<VentasPaginatedResponse>(
        `/ventas?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      throw error;
    }
  },
};
