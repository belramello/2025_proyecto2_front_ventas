import { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import type { Rol } from "../interfaces/rol-interface";
import type { Usuario } from "../interfaces/usuario-interface";
import RoleModificationModal from "./RoleModificationModal";
import "./UsuariosScreen.css";
import { getRolesRequest } from "../services/rolesService";
import { UsuariosService } from "../services/usuariosService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CreateUsuarioModal from "./create-usuarios/CreateUsuariosScreen";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos-enum";

function UsuariosScreen() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = await getRolesRequest();
      setRoles(roles);
    } catch (error) {
      setError(
        "Error al obtener los roles disponibles, porfavor intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const usuariosPaginados = await UsuariosService.getUsuariosRequest();
      setUsuarios(usuariosPaginados.usuarios);
    } catch (error) {
      setError("Error al obtener los usuarios, porfavor intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, nuevoRol: Rol) => {
    setError(null);
    try {
      await UsuariosService.asignarRolAUsuario(userId, nuevoRol.id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, rol: nuevoRol } : u))
      );
    } catch (err) {
      setError("No se pudo asignar el rol. Intentá de nuevo.");
    }
  };

  const retryFetch = () => {
    getRoles();
    getUsuarios();
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
            <PermissionGuard requiredPermissions={Permisos.ASIGNAR_ROL}>
              <button
                className="btn btn-info mx-2 fw-bold text-light"
                onClick={() => setShowCreateModal(true)}
              >
                NUEVO USUARIO
              </button>
            </PermissionGuard>
            <PermissionGuard
              requiredPermissions={Permisos.ACTUALIZAR_PERMISOS_POR_ROL}
            >
              <button
                className="btn btn-outline-purple fw-bold"
                onClick={() => setShowRoleModal(true)}
              >
                MODIFICAR ROL
              </button>
            </PermissionGuard>
          </div>
        </div>
        <PermissionGuard requiredPermissions={Permisos.ASIGNAR_ROL}>
          {error && <ErrorMessage message={error} onRetry={retryFetch} />}
          {loading ? (
            <LoadingSpinner />
          ) : (
            !error && (
              <UserTable
                usuarios={usuarios}
                roles={roles}
                onRoleChange={handleRoleChange}
              />
            )
          )}
        </PermissionGuard>
      </div>
      <PermissionGuard
        requiredPermissions={Permisos.ACTUALIZAR_PERMISOS_POR_ROL}
      >
        <RoleModificationModal
          show={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          roles={roles}
        />
      </PermissionGuard>
      <CreateUsuarioModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={getUsuarios}
      />
    </>
  );
}

export default UsuariosScreen;
