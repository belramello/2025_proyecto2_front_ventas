/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-irregular-whitespace */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPlusCircleFill, BsTruck, BsPencil, BsTrash } from "react-icons/bs";
import FullWidthButton from "../../components/FullWidthButton";
import PrimaryButton from "../../components/Button";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { ProductosService } from "../../services/productosService";
import type { Producto } from "../interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../interfaces/productos-paginated-response.interface";
import "./ProductsList.css";
import { PermissionGuard } from "../../auth/guards/permisos-guard";
import { Permisos } from "../../auth/enums/permisos";

// --- Imports para el modal de Stock ---
import UpdateStockModal from "../Stock/UpdateStock";
import type { UpdateProductoDto } from "../interfaces/Update-producto.dto";

// --- Imports para el modal de Proveedores ---
import ProveedoresModal from "./ProveedoresModal";

// --- Imports para los modals de Editar y Eliminar ---
import EditProductModal from "./EditModal";
import DeleteProductModal from "./DeleteModal";

// --- Usar VITE_API_URL para la URL raíz del servidor ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProductsList = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Estado para el modal Stock ---
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  // --- Estado para el modal Proveedores ---
  const [showProveedoresModal, setShowProveedoresModal] = useState(false);

  // --- Estados para los modals de Editar y Eliminar ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

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

  // --- Handlers para el modal Stock ---
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
    const updateDto: UpdateProductoDto = { stock: nuevoStockTotal };
    await ProductosService.actualizarProducto(productoId, updateDto);
    handleCloseStockModal();
    fetchProductos(page);
  };

  // --- Handlers para el modal Proveedores ---
  const handleOpenProveedoresModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowProveedoresModal(true);
  };

  const handleCloseProveedoresModal = () => {
    setSelectedProducto(null);
    setShowProveedoresModal(false);
  };

  // --- Handlers para el modal Editar ---
  const handleOpenEditModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProducto(null);
    setShowEditModal(false);
  };

  const handleEditUpdateSuccess = () => {
    fetchProductos(page);
  };

  // --- Handlers para el modal Eliminar ---
  const handleOpenDeleteModal = (id: number) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteProductId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteSuccess = () => {
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
          className="products-container table-responsive ms-4 me-4"
          style={{ width: "100%", maxWidth: "100vw", overflowX: "auto" }}
        >
          {error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : loading ? (
            <LoadingSpinner />
          ) : productos.length === 0 ? (
            <p className="text-center mt-4">No hay productos registrados.</p>
          ) : (
            <table className="products-table table table-striped table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th className="col-foto">Foto</th>
                  <th className="col-nombre">Nombre</th>
                  <th className="col-descripcion">Descripción</th>
                  <th className="col-linea">Línea</th>
                  <th className="col-codigo">Código</th>
                  <th className="col-stock">Stock</th>
                  <th className="col-precio">Precio</th>
                  <th className="col-proveedores">Proveedores</th>
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
                    className={producto.stock < 10 ? "low-stock-row" : ""}
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
                        <div className="product-image-placeholder">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="col-nombre">{producto.nombre}</td>
                    <td className="col-descripcion">{producto.descripcion}</td>
                    <td className="col-linea">{producto.linea.nombre}</td>
                    <td className="col-codigo">{producto.codigo}</td>
                    <td className="col-stock">
                      <div className="stock-cell-top">
                        <span>{producto.stock}</span>
                        <PermissionGuard
                          requiredPermissions={Permisos.MODIFICAR_PRODUCTOS}
                        >
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Actualizar Stock"
                            onClick={() => handleOpenStockModal(producto)}
                          >
                            <BsFillPlusCircleFill />
                          </button>
                        </PermissionGuard>
                      </div>
                      {producto.stock < 10 && (
                        <span className="badge bg-warning text-dark">
                          POCO STOCK
                        </span>
                      )}
                    </td>
                    <td className="col-precio">${producto.precio}</td>
                    <td className="col-proveedores">
                      <PrimaryButton
                      label={<BsTruck />}
                      variant="info"
                      title="Ver Proveedores"
                      onClick={() => handleOpenProveedoresModal(producto)}
                    />
                    </td>
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
                              label={<BsPencil />}
                              variant="warning"
                              onClick={() => handleOpenEditModal(producto)}
                            />
                          </PermissionGuard>
                          <PermissionGuard
                            requiredPermissions={Permisos.ELIMINAR_PRODUCTOS}
                          >
                            <PrimaryButton
                              label={<BsTrash />}
                              variant="danger"
                              onClick={() => handleOpenDeleteModal(producto.id)}
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

      {/* --- Renderizado del Modal Stock --- */}
      <UpdateStockModal
        show={showStockModal}
        onHide={handleCloseStockModal}
        producto={selectedProducto}
        onStockUpdate={handleStockUpdate}
      />

      {/* --- Renderizado del Modal Proveedores --- */}
      <ProveedoresModal
        show={showProveedoresModal}
        onHide={handleCloseProveedoresModal}
        producto={selectedProducto}
      />

      {/* --- Renderizado del Modal Editar --- */}
      <EditProductModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        producto={selectedProducto}
        onUpdateSuccess={handleEditUpdateSuccess}
      />

      {/* --- Renderizado del Modal Eliminar --- */}
      <DeleteProductModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        productId={deleteProductId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default ProductsList;