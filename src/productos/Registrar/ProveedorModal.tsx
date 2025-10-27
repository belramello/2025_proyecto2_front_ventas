// src/proveedores/components/AddProveedorModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { ProveedoresService } from "../../services/proveedoresService"; // Ajusta la ruta
import SelectProvinciaLocalidad from "../../components/ProvinciaLocalidadSelect"; // Ajusta la ruta
import type { Proveedor } from "../../proveedores/interfaces/proveedores-interface";

interface AddProveedorModalProps {
  show: boolean;
  onHide: () => void;
  onProveedorCreated: (nuevoProveedor: Proveedor) => void;
}

const AddProveedorModal: React.FC<AddProveedorModalProps> = ({
  show,
  onHide,
  onProveedorCreated,
}) => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!show) {
      setNombre("");
      setDireccion("");
      setEmail("");
      setContacto("");
      setProvincia("");
      setLocalidad("");
      setError(null);
      setLoading(false);
      // Nota: Es posible que necesites un método para resetear SelectProvinciaLocalidad
    }
  }, [show]);

  const handleUbicacionChange = (prov: string, loc: string) => {
    setProvincia(prov);
    setLocalidad(loc);
  };

  const handleSubmit = async () => {
    setError(null);

    // Validaciones
    if (!nombre || !direccion || !email || !contacto) {
      setError("Completá todos los campos obligatorios.");
      return;
    }
    if (!provincia || !localidad) {
      setError("Seleccioná una provincia y localidad.");
      return;
    }
    const direccionValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+ \d{1,5}$/.test(
      direccion.trim()
    );
    if (!direccionValida) {
      setError("Ingresá una dirección válida (ejemplo: Alvear 1345).");
      return;
    }
    const contactoValido = /^\d+$/.test(contacto.trim());
    if (!contactoValido) {
      setError("El contacto debe contener solo números (ejemplo: 36373847).");
      return;
    }
    // Fin Validaciones

    const dto = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      email: email.trim(),
      contacto: contacto.trim(),
      provincia,
      localidad,
    };

    setLoading(true);
    try {
      // Asumimos que registrarProveedor devuelve el Proveedor creado
      const nuevoProveedor = await ProveedoresService.registrarProveedor(dto);
      
      alert("¡Proveedor creado con éxito!");
      onProveedorCreated(nuevoProveedor); // Devolver al padre
      onHide(); // Cerrar modal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error registrarProveedor:", err);
      setError(
        err?.message || "No se pudo registrar el proveedor. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Reutilizamos el formulario y sus clases */}
        <Form className="form-proveedor" onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="formProveedorNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProveedorDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProveedorEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProveedorContacto">
            <Form.Label>Contacto</Form.Label>
            <Form.Control
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          {/* Componente anidado de Provincia/Localidad */}
          <SelectProvinciaLocalidad onChange={handleUbicacionChange} />

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" />
              <span className="ms-2">Guardando...</span>
            </>
          ) : (
            "Guardar Proveedor"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProveedorModal;