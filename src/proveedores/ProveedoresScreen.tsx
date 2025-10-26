import { BsFillPlusCircleFill } from "react-icons/bs";
import PrimaryButton from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { ProveedoresService } from "../services/proveedoresService";
import type { Proveedor } from "./interfaces/proveedores-interface";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmModal from "../components/ConfirmModal";
import "./ProveedoresList.css";

const ProveedorScreen = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState<{ id: number; nombre: string } | null>(null);

    const fetchProveedores = useCallback(async (pageNumber: number) => {
        setLoading(true);
        setError(null);
        try {
        const data = await ProveedoresService.getProveedor(pageNumber);
        setProveedores(Array.isArray(data.proveedores) ? data.proveedores : []);
        setLastPage(data.lastPage || 1);
        setPage(data.page || 1);
        } catch (err) {
        console.error("Error cargando proveedores:", err);
        setError("Error cargando proveedores. Intentá de nuevo.");
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProveedores(page);
    }, [page]);

    const handleRetry = () => fetchProveedores(page);

    const solicitarEliminacion = (id: number, nombre: string) => {
        setProveedorAEliminar({ id, nombre });
        setModalVisible(true);
    };

    const confirmarEliminacion = async () => {
        if (!proveedorAEliminar) return;

        setModalVisible(false);
        setLoading(true);
        try {
        await ProveedoresService.eliminarProveedorPorId(proveedorAEliminar.id);
        await fetchProveedores(page);
        } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        alert("Hubo un problema al eliminar el proveedor. Intentá de nuevo.");
        } finally {
        setLoading(false);
        setProveedorAEliminar(null);
        }
    };

  return (
    <div className="container-fluid mt-3 px-4">
      <div className="proveedores-header-container">
        <div>
          <h1 className="mb-1">Gestión de Proveedores</h1>
          <p className="text-muted mb-0">Gestioná los proveedores de tu negocio.</p>
        </div>
        <button
          className="btn-purple-pastel"
          onClick={() => navigate("/nuevo-proveedor")}
        >
          <BsFillPlusCircleFill />
          Nuevo Proveedor
        </button>
      </div>

      <div className="table-responsive">
        {error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : loading ? (
          <LoadingSpinner />
        ) : proveedores.length === 0 ? (
          <p className="text-center mt-4">No hay proveedores registrados.</p>
        ) : (
          <table className="table table-striped table-bordered table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Email</th>
                <th>Contacto</th>
                <th>Localidad</th>
                <th>Provincia</th>
                <th>Opción</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.nombre}</td>
                  <td>{prov.direccion}</td>
                  <td>{prov.email}</td>
                  <td>{prov.contacto}</td>
                  <td>{prov.localidad}</td>
                  <td>{prov.provincia}</td>
                  <td>
                    <PrimaryButton
                      label="ELIMINAR"
                      variant="danger"
                      onClick={() => solicitarEliminacion(prov.id, prov.nombre)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!error && proveedores.length > 0 && (
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {proveedorAEliminar && (
        <ConfirmModal
          show={modalVisible}
          title="Confirmar eliminación"
          message={`¿Realmente  querés eliminar al proveedor "${proveedorAEliminar.nombre}"?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ProveedorScreen;
