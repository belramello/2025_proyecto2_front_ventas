import type { VentasPaginatedResponse } from "../ventas/interfaces/ventas-paginated-response.interface";
import api from "../utils/api";
import type { CreateVentaDto } from "../ventas/interfaces/create-venta.interface";
import type { VerDetalleVentaResponse } from "../ventas/interfaces/ver-detalle-venta.interface";

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

  async registrarVenta(createVentaDto: CreateVentaDto): Promise<void> {
    try {
      await api.post(`/ventas`, createVentaDto);
      return;
    } catch (error) {
      console.error("Error al registrar venta:", error);
      throw error;
    }
  },

  async getVentaById(id: number): Promise<VerDetalleVentaResponse> {
    try {
      const { data } = await api<VerDetalleVentaResponse>(`/ventas/${id}`);
      return data;
    } catch (error) {
      console.error("Error al obtener la venta:", error);
      throw error;
    }
  },
};
