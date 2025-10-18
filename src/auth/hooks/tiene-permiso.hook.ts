import { useAuth } from "../context/authContext";
import type { PermisosType } from "../enums/permisos-enum";

export const tienePermisoHook = () => {
  const { permisos } = useAuth();

  const tienePermiso = (permiso: PermisosType | PermisosType[]): boolean => {
    if (Array.isArray(permiso)) {
      return permiso.some((p) => permisos?.includes(Number(p)));
    }
    return permisos?.includes(Number(permiso)) ?? false;
  };

  return { tienePermiso };
};
