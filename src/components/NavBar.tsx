import { useContext } from "react";
import { BsBook } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import { cerrarSesion } from "../services/authService";

function NavBarComponent() {
  const authContext = useContext(AuthContext); // Usa useContext
  if (!authContext) {
    throw new Error("Navbar debe estar dentro de AuthProvider");
  }
  const { logout } = authContext;
  const handleLogout = () => {
    cerrarSesion();
    logout();
  };
  return (
    <div>
      <nav
        className="navbar navbar-expand-md bg-info py-3"
        style={{ ["--bs-body-bg"]: "var(--bs-warning)" } as any}
      >
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon">
              <BsBook size="1em" />
            </span>
            <span>Dauria</span>
          </a>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navcol-1"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/inicio">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/usuarios">
                  Usuarios
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/productos">
                  Productos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ventas">
                  Ventas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/marcas">
                  Marcas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/proveedores">
                  Proveedores
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/seguridad">
                  Seguridad
                </a>
              </li>
            </ul>
            <a href="index.html">
              <FaRegUserCircle
                style={
                  {
                    fontSize: "37px",
                    ["--bs-body-color"]: "var(--bs-secondary)",
                    color: "var(--bs-black)",
                  } as any
                }
              />
            </a>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
