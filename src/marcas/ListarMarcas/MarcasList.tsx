import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import PrimaryButton from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { MarcasService } from "../../services/marcasService";
import type { Marca } from "../interfaces/marca.interface";
import "./MarcasList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MarcasList = () => {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarcas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Marca[] = await MarcasService.getMarcas();
      // Verificamos si 'data' es realmente un array antes de usarlo
      if (Array.isArray(data)) {
          setMarcas(data);
      } else {
          console.error("La respuesta de getMarcas no es un array:", data); // Dejamos este error por si acaso
          setError("Error: formato de datos inesperado.");
          setMarcas([]);
      }
    } catch (err) {
      console.error("Error cargando marcas:", err); // Dejamos este error por si acaso
      setError("Error cargando marcas. Por favor, intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarcas();
  }, [fetchMarcas]);

  const handleRetry = () => {
    fetchMarcas();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro que querés eliminar esta marca?")) {
      setLoading(true);
      try {
        await MarcasService.deleteMarca(id);
        fetchMarcas();
      } catch (error: any) {
        console.error("Error al eliminar la marca:", error); // Dejamos este error por si acaso
        setError(error.response?.data?.message || "Error al eliminar la marca.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid mt-3 px-4">
      <div className="marcas-header-container">
        <div>
          <h1 className="mb-1">Gestión de Marcas</h1>
          <p className="text-muted mb-0">Gestioná las marcas del sistema.</p>
        </div>
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

      <PermissionGuard requiredPermissions={Permisos.VER_MARCAS}>
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            {error ? (
              <ErrorMessage message={error} onRetry={handleRetry} />
            ) : loading ? (
              <LoadingSpinner />
            ) : marcas.length === 0 ? (
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
                      const logoUrl = marca.logo
                        ? `${API_URL}/${marca.logo}`
                        : "/placeholder-logo.jpg"; // Asegurate que la extensión sea correcta

                      return (
                        <tr key={marca.id}>
                          <td>
                            <img
                              src={logoUrl}
                              alt={`Logo ${marca.nombre}`}
                              className="marca-logo-thumbnail"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-logo.jpg"; // Asegurate que la extensión sea correcta
                              }}
                            />
                          </td>
                          <td>{marca.nombre}</td>
                          <td>{marca.descripcion || "-"}</td>
                          <td>{marca.productosAsociados}</td>
                          <td>
                            {/* TODO: Reemplazar por Permisos.MODIFICAR_MARCAS */}
                            <PermissionGuard requiredPermissions={Permisos.MODIFICAR_MARCAS}>
                              <PrimaryButton
                                label="EDITAR"
                                variant="warning"
                                onClick={() => console.log("Editar marca ID:", marca.id)} // TODO: Navegar a ruta de edición
                              />
                            </PermissionGuard>
                          </td>
                          <td>
                            {/* TODO: Reemplazar por Permisos.ELIMINAR_MARCAS */}
                            <PermissionGuard requiredPermissions={Permisos.ELIMINAR_MARCAS}>
                              {marca.productosAsociados > 0 ? (
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
      </PermissionGuard>
    </div>
  );
};

export default MarcasList;