import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
import FullWidthButton from "../../components/FullWidthButton";
import PrimaryButton from "../../components/Button";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { ProductosService } from "../../services/productosService";
import type { Producto } from "../interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../interfaces/productos-paginated-response.interface";
import api from "../../utils/api";
import "./ProductsList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";

const ProductsList = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = api.defaults.baseURL;

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
      <PermissionGuard requiredPermissions={Permisos.CREAR_PRODUCTO}>
        <FullWidthButton
          label="Agregar Producto"
          icon={BsFillPlusCircleFill}
          variant="success"
          onClick={() => navigate("/registrar-producto")}
        />
      </PermissionGuard>
      <PermissionGuard requiredPermissions={Permisos.VER_PRODUCTOS}>
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
            <table className="table table-striped table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th className="col-foto">Foto</th> {/* <-- 1. CLASE AÑADIDA */}
                  <th className="col-nombre">Nombre</th> {/* <-- 2. CLASE AÑADIDA */}
                  <th>Marca</th>
                  <th>Linea</th>
                  <th>Código</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <PermissionGuard
                    requiredPermissions={[
                      Permisos.MODIFICAR_PRODUCTOS,
                      Permisos.ELIMINAR_PRODUCTOS,
                    ]}
                  >
                    <th className="col-opciones">Opciones</th> {/* <-- 3. CLASE AÑADIDA */}
                  </PermissionGuard>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="col-foto"> {/* <-- 1. CLASE AÑADIDA */}
                      {producto.fotoUrl ? (
                        <img
                          src={`${backendUrl}/${producto.fotoUrl}`}
                          alt={producto.nombre}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder">Sin foto</div>
                      )}
                    </td>
                    <td className="col-nombre">{producto.nombre}</td> {/* <-- 2. CLASE AÑADIDA */}
                    <td>{producto.marca.nombre}</td>
                    <td>{producto.linea.nombre}</td>
                    <td>{producto.codigo}</td>
                    <td>
                      {producto.stock}
                      {producto.stock < 10 && (
                        <span className="low-stock ms-2">POCO STOCK</span>
                      )}
                    </td>
                    <td>${producto.precio}</td>
                    <PermissionGuard
                      requiredPermissions={[
                        Permisos.MODIFICAR_PRODUCTOS,
                        Permisos.ELIMINAR_PRODUCTOS,
                      ]}
                    >
                      <td className="col-opciones"> {/* <-- 3. CLASE AÑADIDA */}
                        <div className="d-flex justify-content-center gap-2">
                          <PermissionGuard
                            requiredPermissions={Permisos.MODIFICAR_PRODUCTOS}
                          >
                            <PrimaryButton
                              label="EDITAR"
                              variant="warning"
                              onClick={() => console.log("Editar", producto.id)}
                            />
                          </PermissionGuard>
                          <PermissionGuard
                            requiredPermissions={Permisos.ELIMINAR_PRODUCTOS}
                          >
                            <PrimaryButton
                              label="ELIMINAR"
                              variant="danger"
                              onClick={() =>
                                console.log("Eliminar", producto.id)
                              }
                            />
                          </PermissionGuard>
                        </div>
                      </td>
                    </PermissionGuard>
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