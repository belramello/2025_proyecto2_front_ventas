import type { ReactNode } from "react";
import { useAuth } from "../context/authContext";

interface PermissionGuardProps {
  requiredPermissions: number | number[];
  mode?: "or" | "and"; // modo de validación (default: "or")
  children: ReactNode;
}

export const PermissionGuard = ({
  requiredPermissions,
  mode = "or",
  children,
}: PermissionGuardProps) => {
  const { permisos } = useAuth();

  if (!permisos) return null;

  const permisosArray = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const tienePermiso =
    mode === "and"
      ? // AND
        permisosArray.every((p) => permisos.includes(Number(p)))
      : // OR
        permisosArray.some((p) => permisos.includes(Number(p)));

  if (!tienePermiso) return null;

  return <>{children}</>;
};
