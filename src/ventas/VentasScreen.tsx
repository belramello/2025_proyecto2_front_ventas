import { BsFillPlusCircleFill } from "react-icons/bs";
import PaymentBadge from "../components/PaymentBadge";
import type { MedioDePago } from "../types/MedioDePagoType";
import PrimaryButton from "../components/Button";
import FullWidthButton from "../components/FullWidthButton";
import { useNavigate } from "react-router-dom";

const VentasScreen = () => {
  const navigate = useNavigate();
  const ventas = [
    {
      fecha: "02/10/2024",
      hora: "16:40",
      total: "$14,000.50",
      medioDePago: "débito" as MedioDePago,
      vendedor: "Bel Ramello",
      badgeColor: "#c1daff",
      textColor: "var(--bs-primary)",
    },
    {
      fecha: "02/10/2024",
      hora: "16:30",
      total: "$10,000.50",
      medioDePago: "crédito" as MedioDePago,
      vendedor: "Belén Ramello",
    },
    {
      fecha: "02/10/2024",
      hora: "16:30",
      total: "$10,000.50",
      medioDePago: "efectivo" as MedioDePago,
      vendedor: "Belén Ramello",
    },
  ];

  return (
    <div>
      <h1 className="ms-5 mt-2">Gestión de Ventas</h1>
      <p className="ms-5">Gestioná las ventas de tu negocio.</p>
      <FullWidthButton
        label="Nueva Venta"
        icon={BsFillPlusCircleFill}
        variant="warning"
        onClick={() => navigate("/nueva-venta")} // ✅ correcto
      />
      ;
      <div className="table-responsive ms-4 me-4" style={{ marginTop: "10px" }}>
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
                <td>{venta.fecha}</td>
                <td>{venta.hora}</td>
                <td>{venta.total}</td>
                <td>
                  {venta.medioDePago && (
                    <PaymentBadge medio={venta.medioDePago} />
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
      </div>
    </div>
  );
};

export default VentasScreen;
