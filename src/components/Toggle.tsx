import React from "react";

interface ToggleProps {
  id: number;
  nombre: string;
  checked: boolean;
  onToggle: (id: number) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  nombre,
  checked,
  onToggle,
}) => {
  return (
    <div
      className="d-flex align-items-center justify-content-between border-bottom py-2"
      key={id}
    >
      <span className="text-truncate">{nombre}</span>
      <div className="form-check form-switch m-0">
        <input
          className="form-check-input"
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
          id={`perm-${id}`}
        />
      </div>
    </div>
  );
};
