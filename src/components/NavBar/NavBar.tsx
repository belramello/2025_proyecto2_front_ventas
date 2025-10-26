import { useContext } from "react";
import { BsBook } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { AuthContext } from "../../auth/context/authContext";
import { cerrarSesion } from "../../services/authService";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";

function NavBarComponent() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Navbar debe estar dentro de AuthProvider");
  }
  const { logout } = authContext;

  const handleLogout = () => {
    cerrarSesion();
    logout();
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark custom-navbar shadow-sm py-3">
      <div className="container">
        {/* Marca */}
        <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
          <div className="d-flex align-items-center justify-content-center me-2 rounded-circle bg-light p-2 icon-circle">
            <BsBook size="1.3em" color="#00a890" />
          </div>
          <span className="fs-5">Dauria</span>
        </a>

        {/* Botón móvil */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navcol-1"
          aria-controls="navcol-1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <a className="nav-link active" href="/inicio">
                Inicio
              </a>
            </li>

            <PermissionGuard
              requiredPermissions={[
                Permisos.ASIGNAR_ROL,
                Permisos.ACTUALIZAR_PERMISOS_POR_ROL,
              ]}
            >
              <li className="nav-item">
                <a className="nav-link" href="/usuarios">
                  Usuarios
                </a>
              </li>
            </PermissionGuard>

            <PermissionGuard
              requiredPermissions={[
                Permisos.CREAR_PRODUCTO,
                Permisos.VER_PRODUCTOS,
                Permisos.MODIFICAR_PRODUCTOS,
                Permisos.ELIMINAR_PRODUCTOS,
              ]}
            >
              <li className="nav-item">
                <a className="nav-link" href="/productos">
                  Productos
                </a>
              </li>
            </PermissionGuard>

            <PermissionGuard
              requiredPermissions={[
                Permisos.CREAR_VENTA,
                Permisos.VER_HISTORIAL_VENTAS,
              ]}
            >
              <li className="nav-item">
                <a className="nav-link" href="/ventas">
                  Ventas
                </a>
              </li>
            </PermissionGuard>

            <PermissionGuard
              requiredPermissions={[
                Permisos.CREAR_MARCAS,
                Permisos.VER_MARCAS,
                Permisos.MODIFICAR_MARCAS,
                Permisos.ELIMINAR_MARCAS,
              ]}
            >
              <li className="nav-item">
                <a className="nav-link" href="/marcas">
                  Marcas
                </a>
              </li>
            </PermissionGuard>

            <li className="nav-item">
              <a className="nav-link" href="/proveedores">
                Proveedores
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/lineas">
                Lineas
              </a>
            </li>

            <PermissionGuard requiredPermissions={[Permisos.VER_LOGS]}>
              <li className="nav-item">
                <a className="nav-link" href="/seguridad">
                  Seguridad
                </a>
              </li>
            </PermissionGuard>
          </ul>

          {/* Usuario y Cerrar sesión */}
          <div className="d-flex align-items-center gap-3">
            <FaRegUserCircle size="1.8em" color="white" className="user-icon" />
            <button
              className="btn btn-outline-light btn-sm px-3 rounded-pill"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBarComponent;
