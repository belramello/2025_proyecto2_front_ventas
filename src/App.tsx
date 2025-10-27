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
import HistorialTable from "./auditoria/PantallaAuditoria";
import DashboardScreen from "./dashboard/DashboardScreen";
import RecuperarContraseñaScreen from "./recuperar-contraseña/RecuperarContraseñaScreen";
import ResetContraseñaScreen from "./recuperar-contraseña/ResetContraseñaScreen";
import VentaDetalleScreen from "./ventas/VentaDetalleScreen";
import AddProduct from "./productos/Registrar/AddProduct";
import ProveedorScreen from "./proveedores/ProveedoresScreen";
import AgregarProveedorScreen from "./proveedores/AgregarProveedorScreen";
import LineasScreen from "./lineas/LineasScreen";
import LineasMarcas from "./lineas/LineasMarcas";
import CrearLinea from "./lineas/CrearLinea";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route
            path="/forgot-password"
            element={<RecuperarContraseñaScreen />}
          />
          <Route path="/reset-password" element={<ResetContraseñaScreen />} />

          {/* --- RUTAS PROTEGIDAS (Requieren Login y tienen NavBar) --- */}
          {/* Ruta Inicio (solo Navbar) */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <NavBar />
                <DashboardScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <NavBar />
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
          <Route
            path="/ventas/:id"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[Permisos.VER_HISTORIAL_VENTAS]}
                >
                  <VentaDetalleScreen />
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

          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                {" "}
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
          <Route
            path="/registrar-producto"
            element={
              <ProtectedRoute>
                {" "}
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_PRODUCTOS,
                    Permisos.CREAR_PRODUCTO,
                    Permisos.MODIFICAR_PRODUCTOS,
                    Permisos.ELIMINAR_PRODUCTOS,
                  ]}
                >
                  <AddProduct />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

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

          <Route
            path="/marcas"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_MARCAS,
                    Permisos.CREAR_MARCAS,
                    Permisos.MODIFICAR_MARCAS,
                    Permisos.ELIMINAR_MARCAS,
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
                <PermissionGuard
                  requiredPermissions={Permisos.MODIFICAR_MARCAS}
                >
                  <FormularioMarca />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Seguridad"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard requiredPermissions={[Permisos.VER_LOGS]}>
                  <HistorialTable />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <NavBar />
                <PermissionGuard
                  requiredPermissions={[
                    Permisos.VER_PROVEEDOR,
                    Permisos.CREAR_PROVEEDOR,
                    Permisos.MODIFICAR_PROVEEDOR,
                    Permisos.ELIMINAR_PROVEEDOR,
                  ]}
                >
                  <ProveedorScreen />
                </PermissionGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/nuevo-proveedor"
            element={
              <ProtectedRoute>
                <NavBar />
                <AgregarProveedorScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lineas"
            element={
              <ProtectedRoute>
                <NavBar />
                <LineasScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/obtener-lineasmarcas"
            element={
              <ProtectedRoute>
                <NavBar />
                <LineasMarcas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/nueva-linea"
            element={
              <ProtectedRoute>
                <NavBar />
                <CrearLinea />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
