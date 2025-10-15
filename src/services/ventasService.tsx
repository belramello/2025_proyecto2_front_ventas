import type { VentasPaginatedResponse } from "../interfaces/ventas-paginated-response.interface";
import api from "../utils/api";

export const VentasService = {
  async getVentas(page: number = 1): Promise<VentasPaginatedResponse> {
    const { data } = await api.get<VentasPaginatedResponse>(
      `/ventas?page=${page}`
    );
    return data;
  },
};
