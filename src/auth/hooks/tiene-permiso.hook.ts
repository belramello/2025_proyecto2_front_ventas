import { useAuth } from "../context/authContext";
import type { PermisosType } from "../enums/permisos-enum";

export const tienePermisoHook = () => {
  const { permisos } = useAuth();

  const tienePermiso = (permiso: PermisosType): boolean => {
    return permisos?.includes(Number(permiso)) ?? false;
  };

  return { tienePermiso };
};
