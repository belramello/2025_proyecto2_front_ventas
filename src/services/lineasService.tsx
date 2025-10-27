import type { LineaPaginatedResponse } from "../lineas/interfaces/lineas-paginated-response.interface";
import api from "../utils/api";
import type { CreateLinea } from "../lineas/interfaces/create-linea.interface";
import type { Linea } from "../lineas/interfaces/lineas-interface";

export const LineasService = {
  async getLineas(page: number = 1): Promise<LineaPaginatedResponse> {
    try {
      const { data } = await api.get<LineaPaginatedResponse>(
        `/lineas?page=${page}`
      );
      console.log("data lineas", data);
      return { ...data };
    } catch (error) {
      console.error("Error al obtener las lineas:", error);
      throw error;
    }
  },

  async findAll(page: number = 1): Promise<LineaPaginatedResponse> {
    try {
      const { data } = await api.get<LineaPaginatedResponse>(
        `/lineas?limit=40&page=${page}`
      );
      console.log("data lineas", data);
      return { ...data };
    } catch (error) {
      console.error("Error al obtener las lineas:", error);
      throw error;
    }
  },

  async registrarLineas(CreateLinea: CreateLinea): Promise<void> {
    try {
      console.log("createLineaDto", CreateLinea);
      await api.post(`/lineas`, CreateLinea);
    } catch (error) {
      console.error("Error al registrar linea:", error);
      throw error;
    }
  },

  async eliminarLineaPorId(id: number): Promise<void> {
    try {
      await api.delete(`/lineas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la linea con ID ${id}:`, error);
      throw error;
    }
  },

  async getLineasPorMarca(marcaId: number): Promise<LineaPaginatedResponse> {
    try {
      const { data } = await api.get<LineaPaginatedResponse>(
        `/lineas/por-marca/${marcaId}`
      );
      return data;
    } catch (error) {
      console.error(`Error al obtener líneas de la marca ${marcaId}:`, error);
      throw error;
    }
  },

  async añadirMarca(lineaId: number, marcaId: number): Promise<Linea> {
    try {
      const { data } = await api.post<Linea>(`/lineas/agregar-marca`, {
        lineaId,
        marcaId,
      });
      return data;
    } catch (error) {
      console.error(
        `Error al vincular la marca ${marcaId} con la línea ${lineaId}:`,
        error
      );
      throw error;
    }
  },
};
