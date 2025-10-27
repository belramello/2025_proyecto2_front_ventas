import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import { LineasService } from "../../services/lineasService"; // Ajusta la ruta
import type { Linea } from "../../lineas/interfaces/lineas-interface";

interface AddLineaModalProps {
  show: boolean;
  onHide: () => void;
  onLineaCreated: (nuevaLinea: Linea) => void; // Callback para el padre
  marcaId: number | null; // ID de la marca seleccionada en el formulario principal
}

const AddLineaModal = ({
  show,
  onHide,
  onLineaCreated,
  marcaId,
}: AddLineaModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Limpiar el formulario cuando el modal se cierra o cambia de marca
  useEffect(() => {
    if (!show) {
      setNombre("");
      setDescripcion("");
      setError(null);
      setLoading(false);
    }
  }, [show]);

  // Lógica de envío (Solo CREAR)
  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    // Validamos que se haya pasado un marcaId
    if (!marcaId) {
      setError("No se puede crear una línea sin una marca seleccionada.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Asumimos que el DTO para registrar líneas necesita el 'marcaId'
      const lineaDto = {
        nombre,
        descripcion,
        marcaId, // ¡Importante!
      };

      // Usamos el servicio para crear la línea
      const nuevaLinea = await LineasService.registrarLineas(lineaDto);

      alert("¡Línea creada con éxito!");
      onLineaCreated(nuevaLinea); // 1. Devolver la línea al padre
      onHide(); // 2. Cerrar el modal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Error al crear la línea.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Línea</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Usamos las clases CSS de tu formulario original */}
        <div
          className="product-form"
          style={{ padding: 0, border: "none", boxShadow: "none" }}
        >
          {/* Alerta si no hay marca seleccionada */}
          {!marcaId && (
            <Alert variant="warning">
              Por favor, selecciona una marca en el formulario principal primero.
            </Alert>
          )}

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="modal-linea-nombre">Nombre de la Línea</label>
            <input
              id="modal-linea-nombre"
              type="text"
              name="nombre"
              placeholder="Nombre de la línea"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading || !marcaId}
              autoFocus
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="modal-linea-descripcion">
              Descripción (opcional)
            </label>
            <textarea
              id="modal-linea-descripcion"
              name="descripcion"
              placeholder="Descripción de la línea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading || !marcaId}
            />
          </div>

          {/* Error general */}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={loading || !marcaId} // Deshabilitado si no hay marca
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" />
              <span className="ms-2">Guardando...</span>
            </>
          ) : (
            "Guardar Línea"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLineaModal;