import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import PrimaryButton from "../../components/Button";
import Pagination from "../../components/Pagination"; // Asegurate que esté importado
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { MarcasService } from "../../services/marcasService";
import type { Marca, MarcasPaginatedResponse } from "../interfaces/marca.interface";
import "./MarcasList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MarcasList = () => {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  // --- Estado Paginación ---
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  // --- Fin Estado ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarcas = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    console.log(`[MarcasList] Iniciando fetchMarcas para página ${pageNumber}...`); // Log Inicio
    try {
      const data: MarcasPaginatedResponse = await MarcasService.getMarcas(pageNumber);
      console.log("[MarcasList] Datos paginados recibidos:", data); // Log Datos Crudos

      if (data && Array.isArray(data.marcas)) {
        setMarcas(data.marcas);
        setLastPage(data.lastPage);
        setPage(data.page);
      } else {
        console.error("La respuesta paginada no tiene el formato esperado:", data);
        setError("Error: formato de datos inesperado.");
        setMarcas([]);
        setPage(1);
        setLastPage(1);
      }

    } catch (err) {
      console.error("[MarcasList] Error DETALLADO en fetchMarcas:", err); // Log Error
      setError("Error cargando marcas. Por favor, intentá de nuevo.");
    } finally {
      setLoading(false);
      console.log("[MarcasList] Finalizando fetchMarcas."); // Log Fin
    }
  }, []);

  useEffect(() => {
    fetchMarcas(page);
  }, [page, fetchMarcas]);

  const handleRetry = () => {
    fetchMarcas(page);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro que querés eliminar esta marca?")) {
      setLoading(true);
      try {
        await MarcasService.deleteMarca(id);
        if (marcas.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchMarcas(page);
        }
      } catch (error: any) {
        console.error("Error al eliminar la marca:", error);
        setError(error.response?.data?.message || "Error al eliminar la marca.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Log Renderizado ---
  console.log("[MarcasList] Renderizando componente. Estado marcas:", marcas);

  return (
    <div className="container-fluid mt-3 px-4">
      <div className="marcas-header-container">
        <div>
          <h1 className="mb-1">Gestión de Marcas</h1>
          <p className="text-muted mb-0">Gestioná las marcas del sistema.</p>
        </div>
        {/* TODO: Usar Permisos.CREAR_MARCAS */}
        <PermissionGuard requiredPermissions={Permisos.CREAR_MARCAS}>
          <button
            className="btn btn-purple-pastel"
            onClick={() => navigate("/add-marca")}
          >
            <BsPlusLg className="me-2" />
            Agregar Marca
          </button>
        </PermissionGuard>
      </div>

      {/* TODO: Usar Permisos.VER_MARCAS */}
      <PermissionGuard requiredPermissions={Permisos.VER_MARCAS}>
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            {error ? (
              <ErrorMessage message={error} onRetry={handleRetry} />
            ) : loading ? (
              <LoadingSpinner />
            ) : marcas.length === 0 && page === 1 ? (
              <p className="text-center text-muted mt-4">No hay marcas registradas.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Logo</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Productos Asociados</th>
                      <th scope="col">Editar</th>
                      <th scope="col">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marcas.map((marca) => {
                      // --- LOG: DATOS PARA CADA FILA ---
                      // AGREGAR ESTE LOG DE NUEVO
                      console.log(`[MarcasList] Renderizando fila para marca ID ${marca.id}:`, marca);
                      // ---------------------------------

                      const logoPath = marca.logoUrl || '';
                      // Usar logoUrl si viene del mapper, sino construirlo
                      const logoUrl = marca.logoUrl || (marca.logoUrl
                        ? `${API_URL}/${logoPath.startsWith('uploads') ? logoPath : `uploads/logos/${logoPath}`}`
                        : "/placeholder-logo.jpg"); // Asegurate que la extensión coincida

                      return (
                        <tr key={marca.id}>
                          <td>
                            <img
                              src={logoUrl}
                              alt={`Logo ${marca.nombre}`}
                              className="marca-logo-thumbnail"
                              onError={(e) => { e.currentTarget.src = "/placeholder-logo.jpg"; }} // Asegurate que la extensión coincida
                            />
                          </td>
                          <td>{marca.nombre}</td>
                          <td>{marca.descripcion || "-"}</td>
                          {/* Mostrar productos asociados */}
                          <td>{marca.productosAsociados}</td>
                          <td>
                            {/* TODO: Usar Permisos.MODIFICAR_MARCAS */}
                            <PermissionGuard requiredPermissions={Permisos.MODIFICAR_MARCAS}>
                              <PrimaryButton
                                label="EDITAR"
                                variant="warning"
                               onClick={() => navigate(`/edit-marca/${marca.id}`)} // TODO: Navegar a ruta de edición
                              />
                            </PermissionGuard>
                          </td>
                          <td>
                            {/* TODO: Usar Permisos.ELIMINAR_MARCAS */}
                            <PermissionGuard requiredPermissions={Permisos.ELIMINAR_MARCAS}>
                              {/* Verificar si productosAsociados existe y es mayor a 0 */}
                              {typeof marca.productosAsociados === 'number' && marca.productosAsociados > 0 ? (
                                <span className="text-eliminar-advertencia">
                                  No se puede eliminar porque tiene productos asociados
                                </span>
                              ) : (
                                <PrimaryButton
                                  label="ELIMINAR"
                                  variant="danger"
                                  onClick={() => handleDelete(marca.id)}
                                />
                              )}
                            </PermissionGuard>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* --- Componente Pagination --- */}
        {!loading && lastPage > 1 && (
           <Pagination
             currentPage={page}
             lastPage={lastPage}
             onPageChange={(newPage) => setPage(newPage)}
           />
        )}
        {/* --- Fin Pagination --- */}

      </PermissionGuard>
    </div>
  );
};

export default MarcasList;