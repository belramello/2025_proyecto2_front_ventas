import React from "react";
import ActionButton from "./Button";

interface QuantityButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  className = "",
}) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center gap-2 ${className}`}
    >
      <ActionButton
        label="–"
        variant="secondary"
        size="sm"
        onClick={onDecrease}
      />
      <span style={{ minWidth: "24px", textAlign: "center" }}>{quantity}</span>
      <ActionButton
        label="+"
        variant="secondary"
        size="sm"
        onClick={onIncrease}
      />
    </div>
  );
};

export default QuantityButton;
