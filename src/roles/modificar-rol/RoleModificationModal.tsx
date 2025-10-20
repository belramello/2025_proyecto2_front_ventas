import Button from "../../components/Button";
import type { Rol } from "../../interfaces/rol-interface";
import "./RoleModificationModal.css";

interface RoleModificationModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roles: Rol[];
}

function RoleModificationModal({
  show,
  onClose,
  roles,
}: RoleModificationModalProps) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show custom-modal-backdrop"></div>

      <div
        className="modal fade show d-flex align-items-center justify-content-center custom-modal-container"
        tabIndex={-1}
        role="dialog"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered custom-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content custom-modal-content">
            <div className="modal-header border-0 pb-0 pt-3 ps-5">
              <h5 className="modal-title fw-bold custom-modal-title">
                ¿Qué rol querés modificar?
              </h5>
              <button
                type="button"
                className="btn-close me-4"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body pt-1 pb-4">
              <div className="table-responsive custom-table-container">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th className="custom-col-small">#</th>
                      <th className="custom-col-medium">Rol</th>
                      <th className="custom-col-large">Descripción</th>
                      <th className="custom-col-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((rol) => (
                      <tr key={rol.id}>
                        <td>{rol.id}</td>
                        <td className="fw-bold text-start">{rol.nombre}</td>
                        <td className="text-start text-muted">
                          {rol.descripcion}
                        </td>
                        <td>
                          {rol.nombre === "Dueño" ? (
                            <span className="text-muted">-</span>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => console.log("Modificar permisos")}
                            >
                              MODIFICAR
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoleModificationModal;
