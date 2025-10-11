import { useState } from "react";
import UserTable from "../components/UserTable";
import type { Permiso } from "../interfaces/permisoInterface";
import type { Rol } from "../interfaces/rolInterface";
import type { Usuario } from "../interfaces/usuarioInterface";
import RoleModificationModal from "./RoleModificationModal";
import "./UsuariosScreen.css";

function UsuariosScreen() {
  const [showRoleModal, setShowRoleModal] = useState(false);

  const permisosEjemplo: Permiso[] = [
    { id: 1, nombre: "Crear producto", categoria: "productos" },
    { id: 2, nombre: "Editar producto", categoria: "productos" },
  ];

  const rolesIniciales: Rol[] = [
    {
      id: 1,
      nombre: "Administrador",
      modificable: true,
      permisos: permisosEjemplo,
      descripcion: "Control total del sistema",
    },
    {
      id: 2,
      nombre: "Vendedor",
      modificable: true,
      permisos: [],
      descripcion: "Gestiona ventas por mostrador",
    },
    {
      id: 3,
      nombre: "Auditor de Seguridad",
      modificable: false,
      permisos: [],
      descripcion: "Acceso sólo a logs de seguridad",
    },
  ];

  const [roles] = useState<Rol[]>(rolesIniciales);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Carolina",
      apellido: "Corazza",
      email: "carolinapaulacorazza@gmail.com",
      rol: rolesIniciales[0],
    },
    {
      id: 2,
      nombre: "Belén",
      apellido: "Ramello",
      email: "belenramello@gmail.com",
      rol: rolesIniciales[1],
    },
    {
      id: 3,
      nombre: "Juan",
      apellido: "Saby",
      email: "juansaby@gmail.com",
      rol: rolesIniciales[2],
    },
  ]);

  const handleRoleChange = (userId: number, nuevoRol: Rol) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, rol: nuevoRol } : u))
    );
  };

  return (
    <>
      <div className="usuarios-screen-container">
        <div className="usuarios-header">
          <div>
            <h1 className="titulo-usuarios">Gestión de Usuarios y Roles</h1>
            <p className="subtitulo-usuarios">
              Asigná roles a los usuarios y modificá los permisos asociados a
              cada rol.
            </p>
          </div>

          <div>
            <button className="btn btn-info mx-2 fw-bold text-light">
              NUEVO USUARIO
            </button>
            <button
              className="btn btn-outline-purple fw-bold"
              onClick={() => setShowRoleModal(true)}
            >
              MODIFICAR ROL
            </button>
          </div>
        </div>

        <UserTable
          usuarios={usuarios}
          roles={roles}
          onRoleChange={handleRoleChange}
        />
      </div>

      <RoleModificationModal
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        roles={roles}
      />
    </>
  );
}

export default UsuariosScreen;
