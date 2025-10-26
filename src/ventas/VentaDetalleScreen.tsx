import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VentasService } from "../services/ventasService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { formatFecha, formatHora } from "../utils/formatDate";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBoxOpen,
} from "react-icons/fa";
import "./VentaDetalleScreen.css";

const VentaDetalleScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const data = await VentasService.getVentaById(Number(id));
        setVenta(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el detalle de la venta.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => navigate(-1)} />;

  return (
    <div className="container venta-detalle-container fade-in">
      <div className="card venta-card mb-4">
        <div className="card-body">
          <h2 className="card-title fw-bold mb-3 ">
            🧾 Detalle de Venta #{venta.id}
          </h2>

          <div className="row mb-2">
            <div className="col-md-6">
              <p className="mb-2">
                <FaUser className="icon me-2" />
                <strong>Vendedor:</strong> {venta.vendedor}
              </p>
              <p className="mb-2">
                <FaCalendarAlt className="icon me-2" />
                <strong>Fecha:</strong> {formatFecha(venta.fecha)}{" "}
                <span className="text-muted">({formatHora(venta.fecha)})</span>
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-2">
                <FaMoneyBillWave className="icon me-2" />
                <strong>Medio de Pago:</strong> {venta.medioDePago}
              </p>
              <p className="fs-5 fw-bold text-success mb-0">
                💰 Total: ${venta.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card venta-card">
        <div className="card-body">
          <h4 className="card-title mb-3 text-secondary">
            <FaBoxOpen className="me-2 text-primary" />
            Detalles de Productos
          </h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle table-striped">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalles.map((detalle: any) => (
                  <tr key={detalle.id}>
                    <td>{detalle.productoNombre}</td>
                    <td className="text-center">{detalle.cantidad}</td>
                    <td className="text-end text-muted">
                      ${detalle.precioUnitario.toLocaleString()}
                    </td>
                    <td className="text-end fw-semibold text-dark">
                      ${detalle.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleScreen;
