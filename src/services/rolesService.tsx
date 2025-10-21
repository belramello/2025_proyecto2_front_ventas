import type { RespuestaFindOneRol } from "../roles/interfaces/find-one-rol.interface";
import type { Permiso } from "../roles/interfaces/permiso-interface";
import type { Rol } from "../roles/interfaces/rol-interface";
import api from "../utils/api";

export const getRolesRequest = async (): Promise<Rol[]> => {
  try {
    const response = await api.get<Rol[]>("/roles");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    throw error;
  }
};

export const updatePermisosRol = async (
  rolId: number,
  permisosId: number[]
): Promise<void> => {
  try {
    await api.patch(`/roles/${rolId}/permisos`, { permisosId });
  } catch (error) {
    console.error("Error actualizando permisos del rol:", error);
    throw error;
  }
};

export const getRolById = async (id: number): Promise<RespuestaFindOneRol> => {
  const { data } = await api.get<RespuestaFindOneRol>(`/roles/${id}`);
  console.log(data);
  return data;
};

export const findAllPermisos = async (): Promise<Permiso[]> => {
  const response = await api.get<Permiso[]>("/permisos");
  return response.data;
};
