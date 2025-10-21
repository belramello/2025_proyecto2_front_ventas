import React from "react";
import type { Usuario } from "../interfaces/usuario-interface";
import type { Rol } from "../roles/interfaces/rol-interface";
import RoleDropdown from "./RoleDropdown";
import ActionButton from "./Button";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos";

interface UserTableProps {
  usuarios: Usuario[];
  roles: Rol[];
  onRoleChange: (userId: number, nuevoRol: Rol) => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  usuarios,
  roles,
  onRoleChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-responsive text-center ms-5 me-4 mt-4">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <PermissionGuard
              requiredPermissions={[
                Permisos.MODIFICAR_USUARIOS,
                Permisos.ELIMINAR_USUARIOS,
              ]}
            >
              <th>Opciones</th>
            </PermissionGuard>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>
                <RoleDropdown
                  rolActual={u.rol}
                  rolesDisponibles={roles}
                  onChange={(nuevoRol) => onRoleChange(u.id, nuevoRol)}
                />
              </td>
              <PermissionGuard
                requiredPermissions={[
                  Permisos.MODIFICAR_USUARIOS,
                  Permisos.ELIMINAR_USUARIOS,
                ]}
              >
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <PermissionGuard
                      requiredPermissions={Permisos.MODIFICAR_USUARIOS}
                    >
                      <ActionButton
                        label="EDITAR"
                        variant="warning"
                        size="sm"
                        onClick={() => onEdit(u)}
                      />
                    </PermissionGuard>
                    <PermissionGuard
                      requiredPermissions={Permisos.ELIMINAR_USUARIOS}
                    >
                      <ActionButton
                        label="ELIMINAR"
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(u)}
                      />
                    </PermissionGuard>
                  </div>
                </td>
              </PermissionGuard>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
