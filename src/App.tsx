import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import VentasScreen from "./ventas/VentasScreen";
import NuevaVentaScreen from "./ventas/NuevaVentaScreen";
import { AuthProvider } from "./auth/context/authContext";
import { ProtectedRoute } from "./auth/routes/ProtectedRoute";
import LoginScreen from "./login/LoginScreen";
import UsuariosScreen from "./roles/UsuariosScreen";
import ProductsList from "./productos/Catálogo/ProductList";
import { PermissionGuard } from "./auth/guards/permisos-guard";
import { Permisos } from "./auth/enums/permisos-enum";

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
                  <NavBar />
                  <VentasScreen />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-venta"
            element={
              <ProtectedRoute>
                <>
                  <PermissionGuard requiredPermission={Permisos.CREAR_VENTA}>
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
                  <PermissionGuard requiredPermission={Permisos.ASIGNAR_ROL}>
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
                <PermissionGuard requiredPermission={Permisos.VER_PRODUCTOS}>
                  <ProductsList />
                </PermissionGuard>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
