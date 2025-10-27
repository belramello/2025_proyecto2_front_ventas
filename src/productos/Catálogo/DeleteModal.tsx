import React from "react";
import Modal from "../../ventas/components/Modal";
import PrimaryButton from "../../components/Button";

interface DeleteProductModalProps {
  show: boolean;
  onHide: () => void;
  productId: number | null;
  onDeleteSuccess: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  show,
  onHide,
  productId,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      await fetch(`/productos/${productId}`, {
        method: "DELETE",
      });
      onDeleteSuccess();
      onHide();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al eliminar el producto. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Confirmar Eliminación"
      footer={
        <>
          <PrimaryButton
            label="Cancelar"
            variant="secondary"
            onClick={onHide}
            disabled={loading}
          />
          <PrimaryButton
            label="Eliminar"
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          />
        </>
      }
    >
      <p>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
      {error && <div className="alert alert-danger">{error}</div>}
    </Modal>
  );
};

export default DeleteProductModal;