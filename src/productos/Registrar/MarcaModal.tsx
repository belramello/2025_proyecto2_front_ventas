import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import { MarcasService } from "../../services/marcasService"; // Ajusta la ruta
import type { Marca } from "../../marcas/interfaces/marca.interface";

interface AddMarcaModalProps {
  show: boolean;
  onHide: () => void;
  onMarcaCreated: (nuevaMarca: Marca) => void; // Callback para el padre
}

const AddMarcaModal = ({ show, onHide, onMarcaCreated }: AddMarcaModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState("Ningún archivo seleccionado");

  // Limpiar el formulario cuando el modal se cierra
  useEffect(() => {
    if (!show) {
      setNombre("");
      setDescripcion("");
      setLogoFile(null);
      setLogoFileName("Ningún archivo seleccionado");
      setError(null);
      setLoading(false);
    }
  }, [show]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoFileName(file.name);
    }
  };

  // Lógica de envío (Solo CREAR)
  const handleSubmit = async () => {
    if (!nombre) {
      setError("El nombre es requerido.");
      return;
    }
    if (!logoFile) {
      setError("El logo es requerido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada a Crear
      const nuevaMarca = await MarcasService.createMarca({
        nombre,
        descripcion,
        logo: logoFile,
      });
      
      alert("¡Marca creada con éxito!");
      onMarcaCreated(nuevaMarca); // <-- 1. Devolver la marca al padre
      onHide(); // <-- 2. Cerrar el modal

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Error al crear la marca.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Marca</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Usamos las clases CSS de tu formulario original 
          (product-form, form-group, etc.) 
        */}
        <div className="product-form" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
          
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="modal-nombre">Nombre de la Marca</label>
            <input
              id="modal-nombre"
              type="text"
              name="nombre"
              placeholder="Escribe el nombre de la marca"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
              autoFocus // Pone el foco aquí al abrir
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="modal-descripcion">Descripción</label>
            <textarea
              id="modal-descripcion"
              name="descripcion"
              placeholder="Escribe la descripción de la marca"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          {/* Logo */}
          <div className="form-group">
            <label className="fw-bold" htmlFor="modal-logo">Logo</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="modal-logo"
                name="logo"
                accept="image/*"
                className="file-input-hidden"
                onChange={handleFileChange}
                required
                disabled={loading}
              />
              <label htmlFor="modal-logo" className="btn teal m-0">
                Seleccionar archivo...
              </label>
              <span className="file-input-filename">{logoFileName}</span>
            </div>
          </div>
          
          {/* Error general */}
          {error && (
             <Alert variant="danger" className="mt-3">
               {error}
             </Alert>
          )}

        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" />
              <span className="ms-2">Guardando...</span>
            </>
          ) : (
            "Guardar Marca"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMarcaModal;