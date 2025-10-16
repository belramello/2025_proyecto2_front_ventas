import type { UsuariosPaginatedResponse } from "../interfaces/usuarios-paginated-response.interface";
import api from "../utils/api";

export const UsuariosService = {
  async getUsuariosRequest(
    page: number = 1
  ): Promise<UsuariosPaginatedResponse> {
    try {
      const { data } = await api.get<UsuariosPaginatedResponse>(
        `/usuarios?page=${page}`
      );
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  },

  async asignarRolAUsuario(usuarioId: number, rolId: number): Promise<void> {
    try {
      await api.put(`/usuarios/${usuarioId}/asignar-rol/${rolId}`);
      return;
    } catch (error) {
      console.error("Error al asignar rol a usuario:", error);
      throw error;
    }
  },
};
