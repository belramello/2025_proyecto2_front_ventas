import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import type { Rol } from "../interfaces/rol-interface";

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
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const getButtonColor = (rol: string) => {
    switch (rol.toLowerCase()) {
      case "administrador":
        return "btn-warning text-white";
      case "vendedor":
        return "btn-success text-white";
      case "dueño":
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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  return (
    <>
      <div className="btn-group">
        <button
          ref={buttonRef}
          type="button"
          className={`btn dropdown-toggle ${getButtonColor(
            rolSeleccionado.nombre
          )}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {rolSeleccionado.nombre}
        </button>
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className="dropdown-menu show"
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 2000,
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
          </div>,
          document.body
        )}
    </>
  );
};

export default RoleDropdown;
