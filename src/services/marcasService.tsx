import type { Marca } from "../marcas/interfaces/marca.interface";
import api from "../utils/api";

interface CreateMarcaData {
  nombre: string;
  descripcion: string;
  logo: File;
}

export const MarcasService = {

  async getMarcas(): Promise<Marca[]> {
    try {
      const { data } = await api.get<Marca[]>("/marcas");
      

      const dataSimulada = data.map((marca) => ({
        ...marca,
        // Damos valores aleatorios (0, 1 o 5) para probar ambos casos
        productosAsociados: [0, 1, 5][Math.floor(Math.random() * 3)],
      }));
      
      return dataSimulada; 

    } catch (error) {
      console.error("Error al obtener las marcas:", error);
      throw error;
    }
  },

  /**
   * Crea una nueva marca enviando FormData (para el logo).
   */
  async createMarca(marcaData: CreateMarcaData): Promise<Marca> {
    const formData = new FormData();
    formData.append("nombre", marcaData.nombre);
    formData.append("descripcion", marcaData.descripcion);
    formData.append("logo", marcaData.logo);

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

  /**
   * Elimina (soft delete) una marca por su ID.
   */
  async deleteMarca(id: number): Promise<void> {
    try {
      await api.delete(`/marcas/${id}`);
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
      throw error;
    }
  },

  /**
   * Restaura una marca eliminada.
   */
  async restoreMarca(id: number): Promise<void> {
    try {
      await api.patch(`/marcas/${id}/restore`);
    } catch (error) {
      console.error("Error al restaurar la marca:", error);
      throw error;
    }
  },
};