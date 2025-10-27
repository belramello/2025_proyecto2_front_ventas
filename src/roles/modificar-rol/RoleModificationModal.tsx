import Button from "../../components/Button";
import type { Rol } from "../interfaces/rol-interface";
import "./RoleModificationModal.css";
import { useNavigate } from "react-router-dom";

interface RoleModificationModalProps {
  show: boolean;
  onClose: () => void;
  roles: Rol[];
}

function RoleModificationModal({
  show,
  onClose,
  roles,
}: RoleModificationModalProps) {
  if (!show) return null;
  const navigate = useNavigate();

  return (
    <>
      <div className="modal-backdrop fade show custom-modal-backdrop"></div>

      <div
        className="modal fade show custom-modal-container"
        tabIndex={-1}
        role="dialog"
        onClick={onClose}
      >
        <div
          className="modal-dialog custom-modal-dialog"
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
              <div className="custom-table-container">
                <table className="table table-hover align-middle custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Rol</th>
                      <th>Descripción</th>
                      <th>Acción</th>
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
                              onClick={() =>
                                navigate(`/roles/${rol.id}/permisos`)
                              }
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
