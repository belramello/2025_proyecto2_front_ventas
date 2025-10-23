import React, { useEffect, useState, useCallback } from "react";
import { AuditoriaService } from "../services/auditoriaService";
import type { Historial } from "./interfaces/HistorialActividades.dto";
import "./Auditoria.css"; // Ensure this path is correct
import { debounce } from "lodash"; // Import lodash for debouncing

// Función utilitaria para generar nombres de clases CSS a partir de strings
const slugify = (text: string | undefined): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ /g, "-") // Reemplaza espacios por guiones
    .replace(/[^\w-]+/g, "") // Elimina caracteres no alfanuméricos
    .replace(/--+/g, "-") // Reemplaza múltiples guiones por uno solo
    .replace(/^-+/, "") // Elimina guiones al inicio
    .replace(/-+$/, ""); // Elimina guiones al final
};

// Lista de acciones posibles (basada en tu lista)
const actions = [
  "Iniciar sesion",
  "Cerrar sesion",
  "Cambiar contraseña",
  "Actualizar perfil",
  "Recuperar contraseña",
  "Acceso denegado",
  "Creación de producto",
  "Modificacion de producto",
  "Eliminacion de producto",
  "Creación de marca",
  "Modificacion de marca",
  "Eliminacion de marca",
  "Creación de línea",
  "Modificacion de línea",
  "Eliminacion de línea",
  "Registro de venta",
  "Registro nuevo usuario",
];

// Componente principal
const HistorialTable: React.FC = () => {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>(""); // Estado para la acción seleccionada

  // Función para buscar historial con filtros
  const fetchHistorial = async (pageNumber: number, search: string, action: string) => {
    try {
      setLoading(true);
      // Llamada al servicio con parámetros de búsqueda y filtro
      const data = await AuditoriaService.getHistorial(pageNumber, search, action);

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

  // Debounce para la búsqueda
  const debouncedFetchHistorial = useCallback(
    debounce((page: number, search: string, action: string) => {
      fetchHistorial(page, search, action);
    }, 500),
    []
  );

  // Efecto para recargar datos cuando cambian página, búsqueda o acción
  useEffect(() => {
    debouncedFetchHistorial(page, searchTerm, selectedAction);
  }, [page, searchTerm, selectedAction, debouncedFetchHistorial]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Resetear a la primera página al cambiar la búsqueda
  };

  // Manejar cambio en el filtro de acción
  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAction(e.target.value);
    setPage(1); // Resetear a la primera página al cambiar el filtro
  };

  // Limpiar filtros y búsqueda
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedAction("");
    setPage(1);
  };

  if (loading) return <p className="loading-text">Cargando historial...</p>;

  return (
    <div className="auditoria-container">
      <h2 className="auditoria-titulo">Auditoría de Actividades</h2>
      <p className="auditoria-descripcion">
        Consulta todas las actividades realizadas en el sistema y eventos sensibles.
      </p>

      {/* Filtros y Búsqueda */}
      <div className="auditoria-filtros">
        <span className="filtro-accion-label">FILTRAR POR ACCIÓN</span>
        <select
          className="btn-filtro"
          value={selectedAction}
          onChange={handleActionChange}
        >
          <option value="">Todas</option>
          {actions.map((action) => (
            <option key={slugify(action)} value={action}>
              {action}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn-buscar" onClick={() => fetchHistorial(1, searchTerm, selectedAction)}>
          BUSCAR
        </button>
        <button className="btn-filtro" onClick={handleClearFilters}>
          LIMPIAR
        </button>
      </div>

      {/* Mensaje de no hay registros */}
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
                  <span className={`badge estado-${slugify(item.estado?.nombre)}`}>
                    {item.estado?.nombre}
                  </span>
                </td>
                <td>{new Date(item.fechaHora).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <div className="paginacion">
        <button
          className="boton"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {lastPage}
        </span>
        <button
          className="boton"
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