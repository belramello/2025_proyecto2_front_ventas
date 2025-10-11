import React from "react";
import type { IconType } from "react-icons/lib";

interface FullWidthButtonProps {
  label: string;
  icon?: IconType;
  variant?: "primary" | "warning" | "success" | "danger" | "secondary";
  onClick?: () => void;
}

const FullWidthButton: React.FC<FullWidthButtonProps> = ({
  label,
  icon: Icon,
  variant = "primary",
  onClick,
}) => {
  return (
    <div className="mx-5 my-3">
      {" "}
      <button
        className={`btn btn-${variant} btn-lg w-100 d-flex justify-content-center align-items-center py-4`}
        type="button"
        onClick={onClick}
      >
        {Icon && <Icon style={{ fontSize: "32px", marginRight: "15px" }} />}
        <strong>{label}</strong>
      </button>
    </div>
  );
};

export default FullWidthButton;
