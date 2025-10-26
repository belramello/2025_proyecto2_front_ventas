import { Modal, Button } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }: ConfirmModalProps) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton style={{ borderBottom: "1px solid #7c8d9eff" }}>
      <Modal.Title className="text-center w-100" style={{ fontWeight: 600 }}>
        {title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body className="text-center" style={{ fontSize: "1rem", color: "#1b484bff" }}>
      {message}
    </Modal.Body>

    <Modal.Footer className="d-flex justify-content-center" style={{ gap: "1rem", borderTop: "1px solid #dee2e6" }}>
      <Button
        variant="secondary"
        onClick={onCancel}
        style={{
          backgroundColor: "#b5d5f1ff",
          borderColor: "#6e7f8dff",
          fontWeight: 600,
          minWidth: "100px",
        }}
      >
        Cancelar
      </Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        style={{
          backgroundColor: "#e96969ff",
          borderColor: "#d81b60",
          fontWeight: 600,
          minWidth: "100px",
        }}
      >
        Eliminar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
