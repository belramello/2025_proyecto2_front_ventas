import React from "react";
import type { Usuario } from "../interfaces/usuario-interface";
import type { Rol } from "../interfaces/rol-interface";
import RoleDropdown from "./RoleDropdown";

interface UserTableProps {
  usuarios: Usuario[];
  roles: Rol[];
  onRoleChange: (userId: number, nuevoRol: Rol) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  usuarios,
  roles,
  onRoleChange,
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
