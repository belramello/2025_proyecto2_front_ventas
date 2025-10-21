// src/components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <button
        className="btn btn-outline-primary me-2"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>

      <span className="align-self-center">
        Página {currentPage} de {lastPage}
      </span>

      <button
        className="btn btn-info mx-2"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
