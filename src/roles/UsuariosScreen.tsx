import { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import type { Rol } from "../interfaces/rol-interface";
import type { Usuario } from "../interfaces/usuario-interface";
import "./UsuariosScreen.css";
import { getRolesRequest } from "../services/rolesService";
import { UsuariosService } from "../services/usuariosService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CreateUsuarioModal from "./crear-usuarios/CreateUsuarioModal";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos";
import Pagination from "../components/Pagination";
import EditUsuarioModal from "./modificar-usuarios/ModificarUsuarioModal";
import RoleModificationModal from "./modificar-rol/RoleModificationModal";

function UsuariosScreen() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(
    null
  );

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
    fetchUsuarios(page);
  }, []);

  const fetchUsuarios = async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const usuariosPaginados = await UsuariosService.getUsuariosRequest(
        pageNumber
      );
      setUsuarios(usuariosPaginados.usuarios);
      setLastPage(usuariosPaginados.lastPage ?? 1);
      setPage(usuariosPaginados.page ?? pageNumber);
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

  const handleDeleteUser = async (usuario: Usuario) => {
    const confirma = window.confirm(
      `¿Estás seguro que querés eliminar al usuario "${usuario.nombre} ${usuario.apellido}"? Esta acción no se puede deshacer.`
    );
    if (!confirma) return;
    setError(null);
    setLoading(true);
    try {
      await UsuariosService.eliminarUsuario(usuario.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
      await fetchUsuarios(page);
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      setError("No se pudo eliminar el usuario. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
  };

  const onEditSuccess = () => {
    setUsuarioParaEditar(null);

    fetchUsuarios(page);
  };

  const retryFetch = () => {
    getRoles();
    fetchUsuarios(page);
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
            <PermissionGuard requiredPermissions={Permisos.CREAR_USUARIOS}>
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
                className="btn btn-info mx-2  fw-bold"
                onClick={() => setShowRoleModal(true)}
              >
                MODIFICAR ROL
              </button>
            </PermissionGuard>
          </div>
        </div>
        <PermissionGuard requiredPermissions={Permisos.VER_USUARIOS}>
          {error && <ErrorMessage message={error} onRetry={retryFetch} />}
          {loading ? (
            <LoadingSpinner />
          ) : (
            !error && (
              <>
                <UserTable
                  usuarios={usuarios}
                  roles={roles}
                  onRoleChange={handleRoleChange}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />

                <Pagination
                  currentPage={page}
                  lastPage={lastPage}
                  onPageChange={(newPage) => fetchUsuarios(newPage)}
                />
              </>
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

      <PermissionGuard requiredPermissions={Permisos.CREAR_USUARIOS}>
        <CreateUsuarioModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => fetchUsuarios(page)}
        />
      </PermissionGuard>

      <PermissionGuard requiredPermissions={Permisos.MODIFICAR_USUARIOS}>
        <EditUsuarioModal
          show={!!usuarioParaEditar}
          usuario={usuarioParaEditar}
          onClose={() => setUsuarioParaEditar(null)}
          onSuccess={onEditSuccess}
          roles={roles}
        />
      </PermissionGuard>
    </>
  );
}

export default UsuariosScreen;
