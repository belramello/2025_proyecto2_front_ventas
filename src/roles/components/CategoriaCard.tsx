import React from "react";
import { Toggle } from "./Toggle";

interface Permiso {
  id: number;
  nombre: string;
}

interface CategoriaCardProps {
  categoria: string;
  permisos: Permiso[];
  selected: Set<number>;
  onToggle: (id: number) => void;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
  categoria,
  permisos,
  selected,
  onToggle,
}) => {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="card border shadow-sm h-100">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h6 className="fw-semibold text-secondary mb-0">{categoria}</h6>
        </div>
        <div className="card-body py-2">
          {permisos.length > 0 ? (
            permisos.map((perm) => (
              <Toggle
                key={perm.id}
                id={perm.id}
                nombre={perm.nombre}
                checked={selected.has(perm.id)}
                onToggle={onToggle}
              />
            ))
          ) : (
            <p className="text-muted text-center small my-3">
              No hay permisos en esta categoría.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
