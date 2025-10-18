import { BsFillPlusCircleFill } from "react-icons/bs";
import PaymentBadge from "../components/PaymentBadge";
import PrimaryButton from "../components/Button";
import FullWidthButton from "../components/FullWidthButton";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { VentasService } from "../services/ventasService";
import type { Venta } from "../interfaces/venta-interface";
import Pagination from "../components/Pagination";
import type { MedioDePago } from "../types/MedioDePagoType";
import { formatFecha, formatHora } from "../utils/formatDate";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos-enum";

const VentasScreen = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVentas = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await VentasService.getVentas(pageNumber);
      setVentas(data.ventas);
      setLastPage(data.lastPage);
      setPage(data.page);
    } catch (err) {
      console.error("Error cargando ventas:", err);
      setError("Error cargando ventas. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentas(page);
  }, [page]);

  const handleRetry = () => {
    fetchVentas(page);
  };

  return (
    <div>
      <h1 className="ms-5 mt-2">Gestión de Ventas</h1>
      <p className="ms-5">Gestioná las ventas de tu negocio.</p>
      <PermissionGuard requiredPermissions={Permisos.CREAR_VENTA}>
        <FullWidthButton
          label="Nueva Venta"
          icon={BsFillPlusCircleFill}
          variant="warning"
          onClick={() => navigate("/nueva-venta")}
        />
      </PermissionGuard>
      ;
      <PermissionGuard requiredPermissions={Permisos.VER_HISTORIAL_VENTAS}>
        <div
          className="table-responsive ms-4 me-4"
          style={{ marginTop: "10px" }}
        >
          {error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : loading ? (
            <LoadingSpinner />
          ) : ventas.length === 0 ? (
            <p className="text-center mt-4">No hay ventas registradas.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha</th>
                  <th style={{ textAlign: "center" }}>Hora</th>
                  <th style={{ textAlign: "center" }}>Total</th>
                  <th style={{ textAlign: "center" }}>Medio de Pago</th>
                  <th style={{ textAlign: "center" }}>Vendedor</th>
                  <th style={{ textAlign: "center" }}>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta, index) => (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td>{formatFecha(venta.fecha)}</td>
                    <td>{formatHora(venta.fecha)}</td>
                    <td>${venta.total}</td>
                    <td>
                      {venta.medioDePago && (
                        <PaymentBadge
                          medio={venta.medioDePago as MedioDePago}
                        />
                      )}
                    </td>
                    <td>{venta.vendedor}</td>
                    <td>
                      <PrimaryButton
                        label="VER DETALLE"
                        onClick={() => console.log("VER DETALLE")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </PermissionGuard>
    </div>
  );
};

export default VentasScreen;
