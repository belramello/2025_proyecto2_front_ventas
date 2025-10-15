import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import VentasScreen from "./ventas/VentasScreen";
import NuevaVentaScreen from "./ventas/NuevaVentaScreen";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginScreen from "./login/LoginScreen";

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
                  <NavBar />
                  <NuevaVentaScreen />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
