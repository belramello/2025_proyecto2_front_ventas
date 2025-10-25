import type { Marca, MarcasPaginatedResponse } from "../marcas/interfaces/marca.interface";
import api from "../utils/api";

// Interface para datos al crear
interface CreateMarcaData {
  nombre: string;
  descripcion: string;
  logo: File;
}

// Interface para datos al actualizar (campos opcionales)
interface UpdateMarcaData {
  nombre?: string;
  descripcion?: string;
  logo?: File | null;
}

export const MarcasService = {

  /**
   * Obtiene la lista PAGINADA de marcas.
   * Incluye simulación de 'productosAsociados'.
   */
  async getMarcas(page: number = 1): Promise<MarcasPaginatedResponse> {
    try {
      const { data } = await api.get<MarcasPaginatedResponse>(`/marcas?page=${page}`);
      console.log("[MarcasService] Respuesta paginada recibida:", data); // Log para verificar

      // -------------------------------------------------------------------
      // TODO: INICIO DE SIMULACIÓN - ¡BORRAR ESTE BLOQUE CUANDO EL BACKEND ESTÉ LISTO!
      console.log("[MarcasService] Aplicando simulación de productosAsociados...");
      // Aplicamos .map() sobre data.marcas (el array dentro del objeto paginado)
      const marcasSimuladas = data.marcas.map((marca: Marca) => ({ // Tipamos 'marca' aquí
        ...marca,
        productosAsociados: [0, 1, 5][Math.floor(Math.random() * 3)],
      }));

      // Devolvemos el objeto paginado completo, reemplazando el array original por el simulado
      return { ...data, marcas: marcasSimuladas };
      // -------------------------------------------------------------------
      // TODO: FIN DE SIMULACIÓN.
      // La línea original es: return data;
      // -------------------------------------------------------------------

    } catch (error) {
      console.error("Error al obtener las marcas:", error);
      throw error;
    }
  },

  /**
   * Obtiene una marca específica por su ID.
   */
  async getMarcaById(id: number): Promise<Marca> { // Devuelve la interfaz Marca
    try {
      // Pedimos la marca al backend (que devolverá MarcaResponseDto mapeado)
      // Lo tipamos como Marca en el frontend por ahora
      const { data } = await api.get<Marca>(`/marcas/${id}`);

      // --- SIMULACIÓN (También al buscar una) ---
      console.log("[MarcasService] Aplicando simulación (findOne):", data);
      // Asegurarse que la interfaz Marca tenga productosAsociados
      if (data) {
        (data as any).productosAsociados = [0, 1, 5][Math.floor(Math.random() * 3)];
      }
      // --- FIN SIMULACIÓN ---

      return data;
    } catch (error) {
      console.error(`Error al obtener la marca ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva marca enviando FormData.
   */
  async createMarca(marcaData: CreateMarcaData): Promise<Marca> { // Devuelve Marca simple
    const formData = new FormData();
    formData.append("nombre", marcaData.nombre);
    formData.append("descripcion", marcaData.descripcion);
    formData.append("logo", marcaData.logo);

    try {
      // El backend devuelve MarcaResponseDto, lo tipamos como Marca por simplicidad
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
   * Actualiza una marca existente. Envía FormData si hay logo.
   */
  async updateMarca(id: number, marcaData: UpdateMarcaData): Promise<Marca> {
    const hasFile = marcaData.logo instanceof File;
    let requestData: FormData | { nombre?: string; descripcion?: string };
    let headers: Record<string, string> = {}; // Objeto vacío por defecto

    if (hasFile && marcaData.logo) {
      // Si hay archivo, preparamos FormData
      requestData = new FormData();
      if (marcaData.nombre !== undefined) requestData.append('nombre', marcaData.nombre);
      if (marcaData.descripcion !== undefined) requestData.append('descripcion', marcaData.descripcion);
      requestData.append('logo', marcaData.logo);
      // Axios seteará 'multipart/form-data' automáticamente
    } else {
      // Si NO hay archivo, preparamos un objeto JSON simple
      requestData = {};
      if (marcaData.nombre !== undefined) requestData.nombre = marcaData.nombre;
      if (marcaData.descripcion !== undefined) requestData.descripcion = marcaData.descripcion;
      // Forzamos el Content-Type a JSON
      headers['Content-Type'] = 'application/json';
    }

    try {
      // Hacemos la petición PATCH
      const { data } = await api.patch<Marca>(`/marcas/${id}`, requestData, { headers });
      return data;
    } catch (error) {
      console.error(`Error al actualizar la marca ${id}:`, error);
      // Re-lanzamos el error para que el componente lo maneje
      throw error;
    }
  },


  
   // Elimina (soft delete) una marca por su ID.

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