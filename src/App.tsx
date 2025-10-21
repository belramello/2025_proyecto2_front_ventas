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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <NavBar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <>
                  <PermissionGuard
                    requiredPermissions={[
                      Permisos.VER_HISTORIAL_VENTAS,
                      Permisos.CREAR_VENTA,
                    ]}
                  >
                    <NavBar />
                    <VentasScreen />
                  </PermissionGuard>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-venta"
            element={
              <ProtectedRoute>
                <>
                  <PermissionGuard requiredPermissions={Permisos.CREAR_VENTA}>
                    <NavBar />
                    <NuevaVentaScreen />
                  </PermissionGuard>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <>
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
              </>
            }
          />
          <Route
            path="/productos"
            element={
              <>
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
              </>
            }
          />
          <Route
            path="/roles/:id/permisos"
            element={
              <ProtectedRoute>
                <PermissionGuard
                  requiredPermissions={Permisos.ACTUALIZAR_PERMISOS_POR_ROL}
                >
                  <NavBar />
                  <ModificarPermisosScreen />
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
