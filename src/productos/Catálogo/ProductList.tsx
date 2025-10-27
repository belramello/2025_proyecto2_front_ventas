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

// --- Imports para el modal ---
import UpdateStockModal from "../Stock/UpdateStock";
import type { UpdateProductoDto } from "../interfaces/Update-producto.dto";
// ------------------------------

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

  // --- Handlers para el modal ---
  const handleOpenStockModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowStockModal(true);
  };

  const handleCloseStockModal = () => {
    setSelectedProducto(null);
    setShowStockModal(false);
  };

  /**
   * Maneja la lógica de actualización del stock.
   * Es llamada por el componente Modal.
   */
  const handleStockUpdate = async (
    productoId: number,
    cantidadIngresada: number
  ) => {
    if (!selectedProducto) {
      throw new Error("No hay un producto seleccionado para actualizar.");
    }

    // Calcular el nuevo stock total
    const stockActual = selectedProducto.stock;
    const nuevoStockTotal = stockActual + cantidadIngresada;

    // Crear el DTO para el servicio
    const updateDto: UpdateProductoDto = {
      stock: nuevoStockTotal,
    };

    // Llamar al servicio.
    // El try/catch lo maneja el componente Modal,
    // que mostrará el error si algo falla.
    await ProductosService.actualizarProducto(productoId, updateDto);

    // Si tiene éxito, cerrar el modal y recargar la lista
    handleCloseStockModal();
    fetchProductos(page); // Recargar la lista para ver el stock actualizado
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
                    <th className="col-opciones">Opciones</th>
                  </PermissionGuard>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="col-foto">
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
                    <td className="col-nombre">{producto.nombre}</td>
                    <td>{producto.marca.nombre}</td>
                    <td>{producto.linea.nombre}</td>
                    <td>{producto.codigo}</td>
                    
                    {/* --- Celda de Stock con Botón --- */}
                    <td className="stock-cell">
                      <span>{producto.stock}</span>
                      {producto.stock < 10 && (
                        <span className="low-stock ms-2">POCO STOCK</span>
                      )}
                      
                      <PermissionGuard 
                        requiredPermissions={Permisos.MODIFICAR_PRODUCTOS}
                      >
                        <button
                          className="btn btn-sm btn-outline-primary ms-2 btn-update-stock"
                          title="Actualizar Stock"
                          onClick={() => handleOpenStockModal(producto)}
                        >
                          <BsFillPlusCircleFill />
                        </button>
                      </PermissionGuard>
                    </td>
                    {/* ---------------------------------- */}
                    
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