import type { Marca, MarcasPaginatedResponse } from "../marcas/interfaces/marca.interface";
import api from "../utils/api";

export interface CreateMarcaData {
  nombre: string;
  descripcion: string;
  logo: File;
  lineasId: number[];
}

export interface UpdateMarcaData {
  nombre?: string;
  descripcion?: string;
  logo?: File | null;
  lineasId?: number[];
}

export const MarcasService = {
  async getMarcas(page: number = 1): Promise<MarcasPaginatedResponse> {
    try {
      const { data } = await api.get<MarcasPaginatedResponse>(`/marcas?page=${page}`);
      console.log("[MarcasService] Respuesta paginada recibida:", data);

      if (!data || !Array.isArray(data.marcas)) {
        console.error("[MarcasService] Formato de respuesta inesperado:", data);
        return { marcas: [], total: 0, page: 1, lastPage: 1 };
      }

      // 🔹 Simulación temporal de productosAsociados
      console.log("[MarcasService] Aplicando simulación de productosAsociados...");
      const marcasSimuladas = data.marcas.map((marca: Marca) => ({
        ...marca,
        productosAsociados: [0, 1, 5][Math.floor(Math.random() * 3)],
      }));

      return { ...data, marcas: marcasSimuladas };
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
      throw error;
    }
  },

  async getMarcaById(id: number): Promise<Marca> {
    try {
      const { data } = await api.get<Marca>(`/marcas/${id}`);

      // 🔹 Simulación también al buscar una sola marca
      console.log("[MarcasService] Aplicando simulación (findOne):", data);
      if (data) {
        (data as any).productosAsociados = [0, 1, 5][Math.floor(Math.random() * 3)];
      }

      return data;
    } catch (error) {
      console.error(`Error al obtener la marca ${id}:`, error);
      throw error;
    }
  },

  async createMarca(marcaData: CreateMarcaData): Promise<Marca> {
    const formData = new FormData();
    formData.append("nombre", marcaData.nombre);
    formData.append("descripcion", marcaData.descripcion);
    formData.append("logo", marcaData.logo);

    // ✅ Enviar los IDs sin corchetes
    marcaData.lineasId.forEach((id) => formData.append("lineasId", String(id)));

    try {
      const { data } = await api.post<Marca>("/marcas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error("Error al crear la marca:", error);
      throw error;
    }
  },

  async updateMarca(id: number, marcaData: UpdateMarcaData): Promise<Marca> {
    const formData = new FormData();
    const hasFile = marcaData.logo instanceof File;

    if (marcaData.nombre !== undefined) formData.append("nombre", marcaData.nombre);
    if (marcaData.descripcion !== undefined) formData.append("descripcion", marcaData.descripcion);
    if (hasFile && marcaData.logo) formData.append("logo", marcaData.logo);

    // ✅ Enviar los IDs sin corchetes
    if (marcaData.lineasId !== undefined) {
      marcaData.lineasId.forEach((lineaId) => formData.append("lineasId", String(lineaId)));
    }

    try {
      const { data } = await api.patch<Marca>(`/marcas/${id}`, formData);
      return data;
    } catch (error) {
      console.error(`Error al actualizar la marca ${id}:`, error);
      throw error;
    }
  },

  async deleteMarca(id: number): Promise<void> {
    try {
      await api.delete(`/marcas/${id}`);
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
      throw error;
    }
  },

  async restoreMarca(id: number): Promise<void> {
    try {
      await api.patch(`/marcas/${id}/restore`);
    } catch (error) {
      console.error("Error al restaurar la marca:", error);
      throw error;
    }
  },
};
