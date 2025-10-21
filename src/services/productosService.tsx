import type { Producto } from "../productos/interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../productos/interfaces/productos-paginated-response.interface";
import api from "../utils/api";

export const ProductosService = {
  async obtenerProductoPorCodigo(codigo: string): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/codigo/${codigo}`);
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  async getProductos(page: number = 1): Promise<ProductosPaginatedResponse> {
    try {
      const { data } = await api.get<ProductosPaginatedResponse>(
        `/productos?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },
};
