import type { ReactNode } from "react";
import { tienePermisoHook } from "../hooks/tiene-permiso.hook";

interface PermissionGuardProps {
  requiredPermission: number;
  children: ReactNode;
}

export const PermissionGuard = ({
  requiredPermission,
  children,
}: PermissionGuardProps) => {
  const { tienePermiso } = tienePermisoHook();

  if (!tienePermiso(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};
