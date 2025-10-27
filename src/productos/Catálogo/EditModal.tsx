/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
// Asegúrate de que estas rutas sean correctas
import Modal from "../../ventas/components/Modal"; 
import PrimaryButton from "../../components/Button";

import { ProductosService } from "../../services/productosService";
import type { Producto } from "../interfaces/producto-interface";
import type { UpdateProductoDto } from "../interfaces/Update-producto.dto";

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

  // Efecto para cargar y limpiar el estado del formulario
  useEffect(() => {
    if (show && producto) {
      setEditProduct({ ...producto }); // Clona el producto para edición
      setError(null); // Limpiar errores al abrir
    } else if (!show) {
      // Limpiar estado al cerrar
      setEditProduct(null);
      setError(null);
      setLoading(false);
    }
  }, [show, producto]);

  // Manejador genérico para todos los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editProduct) return;
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  // --- 1. Lógica de guardado (sin evento 'e') ---
  // Esta función contiene la validación y la llamada a la API
  const handleSubmit = async () => {
    if (!editProduct) return;

    setLoading(true);
    setError(null);

    // Validación de números
    const numPrecio = parseFloat(editProduct.precio.toString());
    const numStock = parseInt(editProduct.stock.toString(), 10);

    if (isNaN(numPrecio) || numPrecio < 0) {
      setError("El precio ingresado no es válido.");
      setLoading(false);
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setError("El stock ingresado no es válido (debe ser 0 o mayor).");
      setLoading(false);
      return;
    }

    const updateData: UpdateProductoDto = {
      nombre: editProduct.nombre,
      descripcion: editProduct.descripcion,
      precio: numPrecio,
      codigo: editProduct.codigo,
      stock: numStock,
      marcaId: editProduct.marca.id,
      lineaId: editProduct.linea.id,
      // Agrega más campos si son editables (e.g., imagen)
    };

    try {
      await ProductosService.actualizarProducto(editProduct.id, updateData);
      onUpdateSuccess(); // Llama al padre para refrescar la lista
      onHide(); // Cierra el modal
    
    } catch (err) {
      console.error(err); // Es bueno loguear el error real
      setError("Error al actualizar el producto. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Manejador del <form> (con evento 'e') ---
  // Esta función se usa en el 'onSubmit' para prevenir la recarga de la página
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    await handleSubmit(); // Llama a la lógica de guardado
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
          
          {/* --- 3. BOTÓN CORREGIDO --- */}
          <PrimaryButton
            label={loading ? "Guardando..." : "Guardar"}
            variant="success"
            onClick={handleSubmit} // Llama a la lógica directamente
            disabled={loading}
          />
        </>
      }
    >
      {editProduct ? (
        // --- 4. FORM CORREGIDO ---
        <form onSubmit={handleFormSubmit}> {/* Llama al manejador del form */}
        
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
              required 
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
          	  step="0.01" // Para precios con decimales
          	  min="0"
          	  disabled={loading}
          	  required
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
          	    required
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
          	    step="1" // Para stock en enteros
          	    disabled={loading}
          	    required
          	  />
          </div>
        	
        	{/* NOTA: Si marca y línea son editables, necesitarías agregar Selects aquí */}

        </form>
      ) : (
        <p>Cargando datos del producto...</p>
      )}
    </Modal>
  );
};

export default EditProductModal;