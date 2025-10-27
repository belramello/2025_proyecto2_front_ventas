import React from "react";
import "./Modal.css"; // Asegúrate de usar el CSS actualizado

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "lg" | "xl"; // Opcional: Tamaño del modal
  centered?: boolean; // Opcional: Centrar verticalmente
}

const Modal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  children,
  footer,
  size = "lg",
  centered = true,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div
        className={`modal-content ${size} ${centered ? "modal-centered" : ""}`}
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro
      >
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button className="modal-close-btn" onClick={onHide}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;