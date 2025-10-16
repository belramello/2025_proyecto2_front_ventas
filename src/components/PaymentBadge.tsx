import React from "react";
import type { MedioDePago } from "../types/MedioDePagoType";

export const MediosDePago = {
  EFECTIVO: "efectivo" as MedioDePago,
  CREDITO: "credito" as MedioDePago,
  DEBITO: "debito" as MedioDePago,
};

interface PaymentBadgeProps {
  medio: MedioDePago;
}

const badgeStyles: Record<MedioDePago, React.CSSProperties> = {
  efectivo: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  credito: {
    backgroundColor: "#d6c8ff",
    color: "#4a148c",
  },
  debito: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
};

const PaymentBadge: React.FC<PaymentBadgeProps> = ({ medio }) => {
  const style = badgeStyles[medio];
  return (
    <span className="badge" style={{ ...style, fontSize: "15px" }}>
      {medio}
    </span>
  );
};

export default PaymentBadge;
