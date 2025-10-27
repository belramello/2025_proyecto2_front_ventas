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
// import api from "../../utils/api"; // <-- Ya no necesitamos esto para la URL
import "./ProductsList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";

// --- Imports para el modal ---
import UpdateStockModal from "../Stock/UpdateStock";
import type { UpdateProductoDto } from "../interfaces/Update-producto.dto";
// ------------------------------

// --- Usar VITE_API_URL para la URL raíz del servidor ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// ---------------------------------------------------------

const ProductsList = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Estado para el modal ---
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  // --------------------------

  const fetchProductos = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data: ProductosPaginatedResponse =
        await ProductosService.getProductos(pageNumber);
      setProductos(data.productos);
      setLastPage(data.lastPage);
      setPage(data.page);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // --- Handlers para el modal (sin cambios) ---
  const handleOpenStockModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowStockModal(true);
  };

  const handleCloseStockModal = () => {
    setSelectedProducto(null);
    setShowStockModal(false);
  };

  const handleStockUpdate = async (
    productoId: number,
    cantidadIngresada: number
  ) => {
    if (!selectedProducto) {
      throw new Error("No hay un producto seleccionado para actualizar.");
    }

    const stockActual = selectedProducto.stock;
    const nuevoStockTotal = stockActual + cantidadIngresada;

    const updateDto: UpdateProductoDto = {
      stock: nuevoStockTotal,
    };

    await ProductosService.actualizarProducto(productoId, updateDto);

    handleCloseStockModal();
    fetchProductos(page);
  };
  // --- Fin Handlers Modal ---

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
                  <th className="col-foto">Foto</th>
                  <th className="col-nombre">Nombre</th>
                  <th>Descripcion</th>
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
                    <th className="col-opciones">Opciones</th>
                  </PermissionGuard>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr
                    key={producto.id}
                    // --- AQUÍ ESTÁ LA LÓGICA ---
                    // Si el stock es menor a 10, se aplica la clase 'low-stock-row'
                    className={
                      producto.stock < 10 ? "low-stock-row" : ""
                    }
                    // ----------------------------------------------------
                  >
                    <td className="col-foto">
                      {producto.fotoUrl ? (
                        <img
                          src={`${API_URL}/${producto.fotoUrl}`}
                          alt={producto.nombre}
                          className="product-image"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-logo.jpg";
                          }}
                        />
                      ) : (
                        <div className="product-image-placeholder">Sin foto</div>
                      )}
                    </td>
                    <td className="col-nombre">{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.linea.nombre}</td>
                    <td>{producto.codigo}</td>

                    <td className="stock-cell">
                      <span>{producto.stock}</span>

                      {/* Se eliminó el <span> de "POCO STOCK" */}

                      <PermissionGuard
                        requiredPermissions={Permisos.MODIFICAR_PRODUCTOS}
                      >
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          title="Actualizar Stock"
                          onClick={() => handleOpenStockModal(producto)}
                        >
                          <BsFillPlusCircleFill />
                        </button>
                      </PermissionGuard>
                    </td>

                    <td>${producto.precio}</td>
                    <PermissionGuard
                      requiredPermissions={[
                        Permisos.MODIFICAR_PRODUCTOS,
                        Permisos.ELIMINAR_PRODUCTOS,
                      ]}
                    >
                      <td className="col-opciones">
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

      {/* --- Renderizado del Modal --- */}
      <UpdateStockModal
        show={showStockModal}
        onHide={handleCloseStockModal}
        producto={selectedProducto}
        onStockUpdate={handleStockUpdate}
      />
      {/* ----------------------------- */}
    </div>
  );
};

export default ProductsList;