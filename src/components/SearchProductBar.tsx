import React from "react";

interface SearchProductBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

const SearchProductBar: React.FC<SearchProductBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Ingrese código del producto",
  className = "",
}) => {
  return (
    <div
      className={`contenedor-busqueda d-flex align-items-center gap-2 ${className}`}
    >
      <input
        type="text"
        className="form-control form-control-sm input-codigo"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="btn btn-outline-primary btn-sm btn-buscar"
        onClick={onSearch}
      >
        Buscar
      </button>
    </div>
  );
};

export default SearchProductBar;
