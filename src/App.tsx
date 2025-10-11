import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import VentasScreen from "./ventas/VentasScreen";
import NuevaVentaScreen from "./ventas/NuevaVentaScreen";
import UsuariosScreen from "./roles/UsuariosScreen";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        <Route path="/inicio" element={<NavBar />} />
        <Route
          path="/ventas"
          element={
            <>
              <NavBar />
              <VentasScreen />
            </>
          }
        />
        <Route
          path="/nueva-venta"
          element={
            <>
              <NavBar />
              <NuevaVentaScreen />
            </>
          }
        />
        <Route
          path="/usuarios"
          element={
            <>
              <NavBar />
              <UsuariosScreen />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
