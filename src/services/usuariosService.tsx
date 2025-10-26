import type { ForgotPasswordDto } from "../recuperar-contraseña/interfaces/forgot-password.dto";
import type { ResetPasswordDto } from "../recuperar-contraseña/interfaces/reset-password.dto";
import type { UpdateUsuarioDto } from "../roles/interfaces/update-usuario.interface";
import type { Usuario } from "../roles/interfaces/usuario-interface";
import type { UsuariosPaginatedResponse } from "../roles/interfaces/usuarios-paginated-response.interface";
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

  async eliminarUsuario(usuarioId: number): Promise<void> {
    try {
      await api.delete(`/usuarios/${usuarioId}`);
      return;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  async actualizarUsuario(
    usuarioId: number,
    payload: UpdateUsuarioDto
  ): Promise<Usuario> {
    try {
      const { data } = await api.patch<Usuario>(
        `/usuarios/${usuarioId}`,
        payload
      );
      return data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  async forgotPassword(payload: ForgotPasswordDto) {
    try {
      return await api.post(`/usuarios/forgot-password`, payload);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Error al solicitar recuperación de contraseña";
      throw new Error(msg);
    }
  },
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      return await api.post<void>(`/usuarios/reset-password`, {
        token: resetPasswordDto.token,
        newPassword: resetPasswordDto.newPassword,
      });
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Error al restablecer contraseña";
      throw new Error(msg);
    }
  },
};
