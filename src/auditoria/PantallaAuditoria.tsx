import React, { useEffect, useState } from "react";
import { AuditoriaService } from "../services/auditoriaService";
import type { Historial } from "./interfaces/HistorialActividades.dto";
import "./Auditoria.css";

const HistorialTable: React.FC = () => {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await AuditoriaService.getHistorial(pageNumber);

      // ✅ Validar estructura antes de usarla
      if (data && Array.isArray(data.data)) {
        setHistorial(data.data);
        setLastPage(data.lastPage || 1);
      } else {
        console.error("Respuesta inesperada del backend:", data);
        setHistorial([]);
        setLastPage(1);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial(page);
  }, [page]);

  if (loading) return <p className="loading-text">Cargando historial...</p>;

  if (!historial || historial.length === 0) {
    return <p className="no-records-text">No hay registros en el historial.</p>;
  }

  return (
    <div className="auditoria-container">
      <h2 className="auditoria-header">Auditoría de Actividades</h2>

      <table className="auditoria-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Estado</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.usuario}</td>
              <td>{item.accion?.nombre}</td>
              <td>{item.estado?.nombre}</td>
              <td>{new Date(item.fechaHora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {lastPage}
        </span>
        <button
          className="btn"
          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          disabled={page === lastPage}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HistorialTable;