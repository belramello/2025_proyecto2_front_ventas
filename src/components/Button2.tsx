import React from "react";

interface ActionButtonProps {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "warning" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset"; // ✅ ya definido correctamente
}

const ActionButton2: React.FC<ActionButtonProps> = ({
  label,
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button", // ✅ valor por defecto
}) => {
  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type} // ✅ ahora se usa correctamente
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      style={{ textAlign: "center" }}
    >
      {children ?? label}
    </button>
  );
};

export default ActionButton2;
