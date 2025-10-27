// src/components/UpdateStockModal.tsx

import { useEffect, useState } from "react";
// --- NUEVO: Importar Alert para errores ---
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import type { Producto } from "../interfaces/producto-interface";

interface UpdateStockModalProps {
  show: boolean;
  onHide: () => void;
  producto: Producto | null;
  // --- MODIFICADO: La función ahora es asíncrona ---
  onStockUpdate: (productoId: number, cantidad: number) => Promise<void>;
}

const UpdateStockModal = ({
  show,
  onHide,
  producto,
  onStockUpdate,
}: UpdateStockModalProps) => {
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState(""); // Error de validación del input
  
  // --- NUEVO: Estados para la API ---
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // Error de la API

  // Limpiar el formulario cuando el modal se cierra o cambia de producto
  useEffect(() => {
    if (!show) {
      setCantidad("");
      setError("");
      setApiError(null); // <-- Limpiar error de API
      setLoading(false); // <-- Resetear loading
    }
  }, [show]);

  // --- FUNCIÓN MODIFICADA: Ahora es async y maneja try/catch ---
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError("");
    setApiError(null); // Limpiar errores previos

    const numCantidad = parseInt(cantidad, 10);

    if (isNaN(numCantidad) || numCantidad <= 0) {
      setError("Ingresá una cantidad válida (número entero mayor a 0).");
      return;
    }

    if (producto) {
      setLoading(true); // Iniciar carga
      try {
        // Llamar a la función del padre (ProductsList)
        await onStockUpdate(producto.id, numCantidad);
        
        // Si tiene éxito, ProductsList se encarga de cerrar el modal
        
      } catch (err) {
        // Si onStockUpdate falla, atrapamos el error aquí
        console.error(err);
        setApiError("Error al actualizar el stock. Intentá de nuevo.");
      } finally {
        setLoading(false); // Finalizar carga
      }
    }
  };
  // --- FIN FUNCIÓN MODIFICADA ---

  if (!producto) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Stock</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Información del producto */}
        <h5>{producto.nombre}</h5>
        <p className="mb-1">
          <strong>Marca:</strong> {producto.marca.nombre}
        </p>
        <p className="mb-1">
          <strong>Línea:</strong> {producto.linea.nombre}
        </p>
        <p className="mb-3">
          <strong>Stock Actual:</strong> {producto.stock}
        </p>

        <hr />

        {/* Formulario de actualización */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formCantidad">
            <Form.Label>
              <strong>Cantidad de productos que ingresaron:</strong>
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Ej: 50"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                if (error) setError(""); // Borrar error de validación
                if (apiError) setApiError(null); // Borrar error de API
              }}
              isInvalid={!!error}
              autoFocus
              min="1"
              disabled={loading} // <-- Deshabilitar mientras carga
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>

          {/* --- NUEVO: Mostrar error de la API --- */}
          {apiError && <Alert variant="danger">{apiError}</Alert>}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => handleSubmit()} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" />
              <span className="ms-2">Actualizando...</span>
            </>
          ) : (
            "Actualizar Stock"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStockModal;