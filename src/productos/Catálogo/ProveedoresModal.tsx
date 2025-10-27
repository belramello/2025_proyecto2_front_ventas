import  { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import type { Producto } from "../interfaces/producto-interface";
import type { DetalleProductoResponse } from "../interfaces/respuesta-detalle-producto.interface";
import { ProductosService } from "../../services/productosService";

interface ProveedoresModalProps {
  show: boolean;
  onHide: () => void;
  producto: Producto | null;
}

const ProveedoresModal = ({ show, onHide, producto }: ProveedoresModalProps) => {
  const [detalleProducto, setDetalleProducto] = useState<DetalleProductoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      if (!show || !producto) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await ProductosService.obtenerDetallesProveedorPorProductoId(producto.id);
        console.log("Detalle del producto recibido:", data);
        setDetalleProducto(data);
      } catch (err: any) {
        console.error("Error al obtener proveedores:", err);
        setError(err.response?.data?.message || "Error al cargar proveedores.");
        setDetalleProducto(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedores();
  }, [show, producto?.id]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="text-center my-3">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Cargando proveedores...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!detalleProducto || detalleProducto.detalles.length === 0) {
      return <p className="text-muted">Este producto no tiene proveedores asociados.</p>;
    }

    return (
      <ListGroup>
        {detalleProducto.detalles.map((prov) => (
          <ListGroup.Item
            key={prov.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{prov.proveedorNombre}</strong>
              <div className="text-muted small">Código: {prov.codigo}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Proveedores de {producto ? producto.nombre : "Producto"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>{renderBody()}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProveedoresModal;
