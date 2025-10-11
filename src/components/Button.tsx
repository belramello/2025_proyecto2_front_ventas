import React from "react";

interface ActionButtonProps {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "warning" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type="button"
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      style={{ textAlign: "center" }}
    >
      {children ?? label}
    </button>
  );
};

export default ActionButton;
