import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import VentasScreen from "./ventas/VentasScreen";
import NuevaVentaScreen from "./ventas/NuevaVentaScreen";
import { AuthProvider } from "./auth/context/authContext";
import { ProtectedRoute } from "./auth/routes/ProtectedRoute";
import LoginScreen from "./login/LoginScreen";
import UsuariosScreen from "./roles/pantalla-inicial/UsuariosScreen";
import ProductsList from "./productos/Catálogo/ProductList";
import { PermissionGuard } from "./auth/guards/permisos-guard";
import { Permisos } from "./auth/enums/permisos";
import ModificarPermisosScreen from "./roles/modificar-rol/ModificarPermisosScreen";
import MarcasList from "./marcas/ListarMarcas/MarcasList"; 
import FormularioMarca from "./marcas/FormularioMarca/FormularioMarca"; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* --- RUTAS PROTEGIDAS (Requieren Login y tienen NavBar) --- */}
          {/* Ruta Inicio (solo Navbar) */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <NavBar />
                {/* Aquí podrías agregar un componente de bienvenida si quisieras */}
              </ProtectedRoute>
            }
          />

          {/* Ruta Ventas */}
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <NavBar /> {/* NavBar se renderiza una vez */}
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_HISTORIAL_VENTAS,
                    Permisos.CREAR_VENTA,
                  ]}
                >
                  <VentasScreen />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          {/* Ruta Nueva Venta */}
          <Route
            path="/nueva-venta"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard requiredPermissions={Permisos.CREAR_VENTA}>
                  <NuevaVentaScreen />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          {/* Ruta Usuarios */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.ASIGNAR_ROL,
                    Permisos.CREAR_USUARIOS,
                    Permisos.ELIMINAR_USUARIOS,
                    Permisos.VER_USUARIOS,
                    Permisos.MODIFICAR_USUARIOS,
                    Permisos.ACTUALIZAR_PERMISOS_POR_ROL,
                  ]}
                >
                  <UsuariosScreen />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          {/* Ruta Productos */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute> {/* Aseguramos ProtectedRoute */}
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_PRODUCTOS,
                    Permisos.CREAR_PRODUCTO,
                    Permisos.MODIFICAR_PRODUCTOS,
                    Permisos.ELIMINAR_PRODUCTOS,
                  ]}
                >
                  <ProductsList />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          {/* Ruta Modificar Permisos de Rol */}
          <Route
            path="/roles/:id/permisos"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard
                  requiredPermissions={Permisos.ACTUALIZAR_PERMISOS_POR_ROL}
                >
                  <ModificarPermisosScreen />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          {/* --- RUTAS DE MARCAS (AHORA SÍ, SIGUIENDO EL PATRÓN) --- */}
          <Route
            path="/marcas"
            element={
              <ProtectedRoute>
                <NavBar />
                {/* TODO: Usar permisos de Marcas */}
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_MARCAS, /* Cambiar */
                    Permisos.CREAR_MARCAS, /* Cambiar */
                    Permisos.MODIFICAR_MARCAS, /* Cambiar */
                    Permisos.ELIMINAR_MARCAS, /* Cambiar */
                  ]}
                >
                  <MarcasList />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-marca"
            element={
              <ProtectedRoute>
                <NavBar />
                {/* TODO: Usar Permisos.CREAR_MARCAS */}
                <PermissionGuard requiredPermissions={Permisos.CREAR_MARCAS}>
                  <FormularioMarca />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-marca/:id"
            element={
              <ProtectedRoute>
                <NavBar />
                {/* TODO: Usar Permisos.MODIFICAR_MARCAS */}
                <PermissionGuard requiredPermissions={Permisos.MODIFICAR_MARCAS}>
                  <FormularioMarca /> {/* Reutilizamos el formulario */}
                </PermissionGuard>
              </ProtectedRoute>
            }
          />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;