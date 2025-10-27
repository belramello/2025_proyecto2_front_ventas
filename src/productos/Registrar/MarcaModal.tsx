import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Alert, Spinner, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { MarcasService } from "../../services/marcasService";
import { LineasService } from "../../services/lineasService";
import type { Marca } from "../../marcas/interfaces/marca.interface";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import { BsTrash } from "react-icons/bs";

// Interfaz para las opciones de react-select
interface SelectOption {
  value: number;
  label: string;
}

interface AddMarcaModalProps {
  show: boolean;
  onHide: () => void;
  onMarcaCreated: (nuevaMarca: Marca) => void; // Callback para el padre
}

const AddMarcaModal = ({
  show,
  onHide,
  onMarcaCreated,
}: AddMarcaModalProps) => {
  const [loading, setLoading] = useState(false); // Para el envío del formulario
  const [loadingInitialData, setLoadingInitialData] = useState(false); // Para cargar líneas
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estado del Logo (copiado de FormularioMarca)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState("Ningún archivo seleccionado");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado de Líneas (copiado de FormularioMarca)
  const [allLineas, setAllLineas] = useState<SelectOption[]>([]);
  const [selectedLineas, setSelectedLineas] = useState<SelectOption[]>([]);

  // Cargar líneas cuando se abre el modal
  useEffect(() => {
    if (show) {
      setLoadingInitialData(true);
      setError(null);

      LineasService.findAll()
        .then((lineasData) => {
          const options = Array.isArray(lineasData)
            ? lineasData.map((linea: Linea) => ({
                value: linea.id,
                label: linea.nombre,
              }))
            : lineasData.lineas.map((linea: Linea) => ({
                value: linea.id,
                label: linea.nombre,
              }));
          setAllLineas(options);
        })
        .catch((err) => {
          console.error("Error al cargar líneas:", err);
          setError("No se pudieron cargar las líneas disponibles.");
        })
        .finally(() => {
          setLoadingInitialData(false);
        });
    }
  }, [show]);

  // Limpiar el formulario cuando el modal se cierra
  useEffect(() => {
    if (!show) {
      setNombre("");
      setDescripcion("");
      setLogoFile(null);
      setLogoFileName("Ningún archivo seleccionado");
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedLineas([]);
      setAllLineas([]); // Limpiar opciones
      setError(null);
      setLoading(false);
      setLoadingInitialData(false);
    }
  }, [show]);

  // Handlers copiados de FormularioMarca
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      handleRemoveLogo(); // Si cancela, quitar la imagen
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    setLogoFileName("Ningún archivo seleccionado");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLineasChange = (
    selectedOptions: readonly SelectOption[] | null
  ) => {
    setSelectedLineas(selectedOptions ? [...selectedOptions] : []);
  };

  // Lógica de envío actualizada
  const handleSubmit = async () => {
    // Validaciones de FormularioMarca
    if (!nombre) {
      setError("El nombre es requerido.");
      return;
    }
    if (!logoFile) {
      setError("El logo es requerido.");
      return;
    }
    if (selectedLineas.length === 0) {
      setError("Debes seleccionar al menos una línea.");
      return;
    }

    setLoading(true);
    setError(null);

    const lineasIdSeleccionadas = selectedLineas.map((option) => option.value);

    try {
      const nuevaMarca = await MarcasService.createMarca({
        nombre,
        descripcion,
        logo: logoFile!,
        lineasId: lineasIdSeleccionadas, // Añadido
      });

      alert("¡Marca creada con éxito!");
      onMarcaCreated(nuevaMarca); // 1. Devolver la marca al padre
      onHide(); // 2. Cerrar el modal

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error al guardar:", err);
      // Lógica de error de FormularioMarca
      const responseError = err.response?.data?.message;
      const errorMsg = Array.isArray(responseError)
        ? responseError.join(", ")
        : responseError || "Error al crear la marca.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      {/* Estilos en línea para replicar FormularioMarca.css */}
      <style>{`
        .file-input-hidden { display: none; }
        .logo-preview-container {
          width: 150px;
          height: 150px;
          border: 2px dashed #ccc;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        .logo-preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .logo-placeholder {
          color: #6c757d;
          font-style: italic;
        }
        .file-input-filename {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 5px;
          word-break: break-all;
        }
      `}</style>

      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Marca</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Usamos Form de react-bootstrap para la estructura */}
        <Form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Row className="g-4">
            {/* Columna Izquierda (Nombre, Desc, Líneas) */}
            <Col md={7}>
              <Form.Group className="mb-3" controlId="modal-nombre">
                <Form.Label className="fw-bold">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribe el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoFocus
                  disabled={loading}
                  isInvalid={
                    !!error &&
                    (error.includes("nombre") || error.includes("registrado"))
                  }
                />
                {(error?.includes("nombre") || error?.includes("registrado")) && (
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="modal-descripcion">
                <Form.Label className="fw-bold">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  style={{ height: "100px", minHeight: "100px" }}
                  placeholder="Escribe la descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="modal-lineas">
                <Form.Label className="fw-bold">Líneas Asociadas</Form.Label>
                <Select
                  id="modal-lineas"
                  isMulti
                  name="lineas"
                  options={allLineas}
                  classNamePrefix="select"
                  placeholder="Selecciona líneas..."
                  value={selectedLineas}
                  onChange={handleLineasChange}
                  isLoading={loadingInitialData}
                  closeMenuOnSelect={false}
                  noOptionsMessage={() => "No hay líneas disponibles"}
                  isDisabled={loading}
                />
                {error && error.includes("línea") && (
                  <div className="text-danger small mt-1">{error}</div>
                )}
              </Form.Group>
            </Col>

            {/* Columna Derecha (Logo) */}
            <Col
              md={5}
              className="d-flex flex-column align-items-center justify-content-start"
            >
              <Form.Label className="fw-bold mb-2">Logo</Form.Label>

              <div className="logo-preview-container mb-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Previsualización"
                    className="logo-preview-image"
                  />
                ) : (
                  <div className="logo-placeholder">Sin logo</div>
                )}
              </div>

              <Form.Control
                type="file"
                id="modal-logo"
                name="logo"
                accept="image/*"
                className="file-input-hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={loading}
              />

              <label htmlFor="modal-logo" className="btn btn-primary mb-2">
                Agregar Imagen
              </label>

              <span className="file-input-filename mb-2 text-center">
                {logoFileName}
              </span>

              {logoFile && (
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={loading}
                >
                  <BsTrash className="me-1" /> Quitar Imagen
                </Button>
              )}

              {error && error.includes("logo") && (
                <div className="text-danger small mt-1">{error}</div>
              )}
            </Col>
          </Row>

          {/* Error general */}
          {error &&
            !error.includes("logo") &&
            !error.includes("línea") &&
            !error.includes("nombre") &&
            !error.includes("registrado") && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
        </Form>
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