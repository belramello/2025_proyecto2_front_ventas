import React, { useState, useEffect } from "react";
import Modal from "../../ventas/components/Modal";
import { ProductosService } from "../../services/productosService";
import type { Producto } from "../interfaces/producto-interface";
import type { UpdateProductoDto } from "../interfaces/Update-producto.dto";
import PrimaryButton from "../../components/Button";

interface EditProductModalProps {
  show: boolean;
  onHide: () => void;
  producto: Producto | null;
  onUpdateSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  onHide,
  producto,
  onUpdateSuccess,
}) => {
  const [editProduct, setEditProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && producto) {
      setEditProduct({ ...producto }); // Clona el producto para edición
      setError(null);
    } else {
      setEditProduct(null);
    }
  }, [show, producto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editProduct) return;
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    setLoading(true);
    setError(null);

    const updateData: UpdateProductoDto = {
      nombre: editProduct.nombre,
      descripcion: editProduct.descripcion,
      precio: parseFloat(editProduct.precio.toString()),
      codigo: editProduct.codigo,
      stock: parseInt(editProduct.stock.toString(), 10),
      marcaId: editProduct.marca.id,
      lineaId: editProduct.linea.id,
      // Agrega más campos si son editables (e.g., imagen)
    };

    try {
      await ProductosService.actualizarProducto(editProduct.id, updateData);
      onUpdateSuccess();
      onHide();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al actualizar el producto. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Editar Producto"
      footer={
        <>
          <PrimaryButton
            label="Cancelar"
            variant="secondary"
            onClick={onHide}
            disabled={loading}
          />
          <PrimaryButton
            label="Guardar"
            variant="success"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => handleSubmit(undefined as any)} // Wrap handleSubmit in an arrow function
            disabled={loading}
          />
        </>
      }
    >
      {editProduct ? (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={editProduct.nombre}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="descripcion"
              value={editProduct.descripcion || ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              className="form-control"
              name="precio"
              value={editProduct.precio}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Código</label>
            <input
              type="text"
              className="form-control"
              name="codigo"
              value={editProduct.codigo}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={editProduct.stock}
              onChange={handleInputChange}
              min="0"
              disabled={loading}
            />
          </div>
          {/* Agrega más campos si son necesarios (e.g., marcaId, lineaId con selects) */}
        </form>
      ) : (
        <p>Cargando datos del producto...</p>
      )}
    </Modal>
  );
};

export default EditProductModal;