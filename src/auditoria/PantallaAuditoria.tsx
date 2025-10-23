import React, { useEffect, useState } from "react";
import { AuditoriaService } from "../services/auditoriaService";
import type { Historial } from "./interfaces/HistorialActividades.dto";
import "./Auditoria.css"; // Asegúrate de que este path sea correcto

// Función utilitaria para generar nombres de clases CSS a partir de strings
const slugify = (text: string | undefined): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ /g, '-') // Reemplaza espacios por guiones
    .replace(/[^\w-]+/g, '') // Elimina caracteres no alfanuméricos
    .replace(/--+/g, '-') // Reemplaza múltiples guiones por uno solo
    .replace(/^-+/, '') // Elimina guiones al inicio
    .replace(/-+$/, ''); // Elimina guiones al final
};

// Componente principal
const HistorialTable: React.FC = () => {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  // Nuevo estado para el campo de búsqueda/filtro (solo para la estructura visual)
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistorial = async (pageNumber: number) => {
    try {
      setLoading(true);
      // Aquí se podría integrar el searchTerm en la llamada al servicio:
      // const data = await AuditoriaService.getHistorial(pageNumber, searchTerm); 
      const data = await AuditoriaService.getHistorial(pageNumber);

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
  }, [page]); // Dependencia: Recargar al cambiar de página

  // Si tuvieras que recargar al buscar, añadirías searchTerm aquí también:
  // }, [page, searchTerm]);

  if (loading) return <p className="loading-text">Cargando historial...</p>;

  // Renderizado del componente
  return (
    <div className="auditoria-container">
      <h2 className="auditoria-titulo">Auditoría de Actividades</h2>
      <p className="auditoria-descripcion">
        Consulta todas las actividades realizadas en el sistema y eventos sensibles.
      </p>

      {/* Estructura de Filtros y Búsqueda (añadida del CSS) */}
      <div className="auditoria-filtros">
        <span className="filtro-accion-label">FILTRAR POR ACCIÓN</span>
        {/* Este botón podría abrir un modal de filtros, por ahora es solo visual */}
        <button className="btn-filtro">
          Todas
        </button> 
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-buscar" 
                // Aquí podrías llamar a fetchHistorial(1) para empezar la búsqueda
                onClick={() => setPage(1)}> 
          BUSCAR
        </button>
      </div>
      
      {/* Mensaje de no hay registros, movido aquí para mostrarse después de los filtros */}
      {(!historial || historial.length === 0) && (
        <p className="no-records-text">No hay registros en el historial.</p>
      )}

      {/* Tabla */}
      {historial && historial.length > 0 && (
        <table className="auditoria-tabla">
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
                <td>
                  <span className={`badge accion-${slugify(item.accion?.nombre)}`}>
    {item.accion?.nombre}
  </span>
                </td>
                <td>
                  {/* Aplicando clase badge para Estado */}
                  <span className={`badge estado-${slugify(item.estado?.nombre)}`}>
                    {item.estado?.nombre}
                  </span>
                </td>
                <td>{new Date(item.fechaHora).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table >
      )}

      {/* Paginación */}
      <div className="paginacion">
        <button
          className="boton" // Usando la clase 'boton'
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {lastPage}
        </span>
        <button
          className="boton" // Usando la clase 'boton'
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