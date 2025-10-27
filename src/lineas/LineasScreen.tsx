import { BsFillPlusCircleFill } from "react-icons/bs";
import PrimaryButton from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { LineasService } from "../services/lineasService";
import type { Linea } from "./interfaces/lineas-interface";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmModal from "../components/ConfirmModal";
import "./LineasScreen.css";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos";

const LineasScreen = () => {
  const navigate = useNavigate();
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lineaAEliminar, setLineaAEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const fetchLineas = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await LineasService.getLineas(pageNumber);
      setLineas(Array.isArray(data.lineas) ? data.lineas : []);
      setLastPage(data.lastPage || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Error cargando líneas:", err);
      setError("Error cargando líneas. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLineas(page);
  }, [page]);

  const handleRetry = () => fetchLineas(page);

  const solicitarEliminacion = (id: number, nombre: string) => {
    setLineaAEliminar({ id, nombre });
    setModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!lineaAEliminar) return;

    setModalVisible(false);
    setLoading(true);
    try {
      await LineasService.eliminarLineaPorId(lineaAEliminar.id);
      await fetchLineas(page);
    } catch (error) {
      console.error("Error al eliminar línea:", error);
      alert("Hubo un problema al eliminar la línea. Intentá de nuevo.");
    } finally {
      setLoading(false);
      setLineaAEliminar(null);
    }
  };

  return (
    <div className="container-fluid mt-3 px-4">
      <div className="lineas-header-container">
        <div>
          <h1 className="mb-1">Gestión de Líneas</h1>
          <p className="text-muted mb-0">
            Gestioná las líneas de productos o servicios.
          </p>
        </div>
        <div className="lineas-botones-container">
          <PermissionGuard requiredPermissions={[Permisos.CREAR_LINEAS]}>
            <button
              className="btn-purple-pastel"
              onClick={() => navigate("/obtener-lineasmarcas")}
            >
              Asociar con una marca
            </button>
          </PermissionGuard>
          <PermissionGuard requiredPermissions={[Permisos.CREAR_LINEAS]}>
            <button
              className="btn-purple2-pastel"
              onClick={() => navigate("/nueva-linea")}
            >
              <BsFillPlusCircleFill />
              Crear Línea
            </button>
          </PermissionGuard>
        </div>
      </div>

      <PermissionGuard requiredPermissions={[Permisos.VER_LINEAS]}>
        <div className="table-responsive">
          {error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : loading ? (
            <LoadingSpinner />
          ) : lineas.length === 0 ? (
            <p className="text-center mt-4">No hay líneas registradas.</p>
          ) : (
            <table className="table table-striped table-bordered table-hover text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <PermissionGuard
                    requiredPermissions={Permisos.ELIMINAR_LINEAS}
                  >
                    <th>Opción</th>
                  </PermissionGuard>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea) => (
                  <tr key={linea.id}>
                    <td>{linea.nombre}</td>
                    <td>{linea.descripcion ?? "No presenta descripción"}</td>
                    <PermissionGuard
                      requiredPermissions={[Permisos.ELIMINAR_LINEAS]}
                    >
                      <td>
                        <PrimaryButton
                          label="ELIMINAR"
                          variant="danger"
                          onClick={() =>
                            solicitarEliminacion(linea.id, linea.nombre)
                          }
                        />
                      </td>
                    </PermissionGuard>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!error && lineas.length > 0 && (
          <Pagination
            currentPage={page}
            lastPage={lastPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </PermissionGuard>

      {lineaAEliminar && (
        <PermissionGuard requiredPermissions={[Permisos.ELIMINAR_LINEAS]}>
          <ConfirmModal
            show={modalVisible}
            title="Confirmar eliminación"
            message={`¿Realmente querés eliminar la línea "${lineaAEliminar.nombre}"?`}
            onConfirm={confirmarEliminacion}
            onCancel={() => setModalVisible(false)}
          />
        </PermissionGuard>
      )}
    </div>
  );
};

export default LineasScreen;
