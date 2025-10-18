import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
import FullWidthButton from "../../components/FullWidthButton";
import PrimaryButton from "../../components/Button";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { ProductosService } from "../../services/productosService";
import type { Producto } from "../../interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../../interfaces/productos-paginated-response.interface";
import "./ProductsList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos-enum";

const ProductsList = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data: ProductosPaginatedResponse =
        await ProductosService.getProductos(pageNumber);
      setProductos(data.productos);
      setLastPage(data.lastPage);
      setPage(data.page);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("Error cargando productos. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos(page);
  }, [page, fetchProductos]);

  const handleRetry = () => {
    fetchProductos(page);
  };

  return (
    <div className="products-page">
      <h1 className="ms-5 mt-2">Gestión de Productos</h1>
      <p className="ms-5">Gestioná los productos del catálogo.</p>
      <PermissionGuard requiredPermission={Permisos.CREAR_PRODUCTO}>
        <FullWidthButton
          label="Agregar Producto"
          icon={BsFillPlusCircleFill}
          variant="success"
          onClick={() => navigate("/add-product")}
        />
      </PermissionGuard>
      <PermissionGuard requiredPermission={Permisos.VER_PRODUCTOS}>
        <div
          className="table-responsive ms-4 me-4"
          style={{ marginTop: "10px" }}
        >
          {error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : loading ? (
            <LoadingSpinner />
          ) : productos.length === 0 ? (
            <p className="text-center mt-4">No hay productos registrados.</p>
          ) : (
            <table className="table table-striped table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Marca</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.codigo}</td>
                    <td>{producto.marca}</td>
                    <td>
                      {producto.stock}
                      {producto.stock < 10 && (
                        <span className="low-stock ms-2">POCO STOCK</span>
                      )}
                    </td>
                    <td>${producto.precio}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <PermissionGuard
                          requiredPermission={Permisos.MODIFICAR_PRODUCTOS}
                        >
                          <PrimaryButton
                            label="EDITAR"
                            variant="warning"
                            onClick={() => console.log("Editar", producto.id)}
                          />
                        </PermissionGuard>
                        <PermissionGuard
                          requiredPermission={Permisos.ELIMINAR_PRODUCTOS}
                        >
                          <PrimaryButton
                            label="ELIMINAR"
                            variant="danger"
                            onClick={() => console.log("Eliminar", producto.id)}
                          />
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </PermissionGuard>
    </div>
  );
};

export default ProductsList;
