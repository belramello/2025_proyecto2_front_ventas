import React, { useState } from "react";
import type { Rol } from "../interfaces/rolInterface";

interface RoleDropdownProps {
  rolActual: Rol;
  rolesDisponibles: Rol[];
  onChange: (nuevoRol: Rol) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  rolActual,
  rolesDisponibles,
  onChange,
}) => {
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol>(rolActual);
  const [isOpen, setIsOpen] = useState(false);

  const getButtonColor = (rol: string) => {
    switch (rol.toLowerCase()) {
      case "administrador":
        return "btn-warning text-white";
      case "vendedor":
        return "btn-success text-white";
      case "auditor de seguridad":
        return "btn-primary text-white";
      default:
        return "btn-secondary text-white";
    }
  };

  const handleSelect = (rol: Rol) => {
    setRolSeleccionado(rol);
    onChange(rol);
    setIsOpen(false);
  };

  return (
    <div className="btn-group position-relative">
      <button
        type="button"
        className={`btn dropdown-toggle ${getButtonColor(
          rolSeleccionado.nombre
        )}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {rolSeleccionado.nombre}
      </button>

      {isOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
          }}
        >
          {rolesDisponibles.map((rol) => (
            <button
              key={rol.id}
              className="dropdown-item"
              onClick={() => handleSelect(rol)}
            >
              {rol.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleDropdown;
