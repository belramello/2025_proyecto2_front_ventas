import type { Rol } from "../interfaces/rol-interface";
import api from "../utils/api";

export const getRolesRequest = async (): Promise<Rol[]> => {
  const response = await api.get<Rol[]>("/roles");
  return response.data;
};
