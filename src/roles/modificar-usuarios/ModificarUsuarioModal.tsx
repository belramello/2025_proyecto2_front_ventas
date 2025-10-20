import { useEffect, useState } from "react";
import type { Rol } from "../../interfaces/rol-interface";
import type { Usuario } from "../../interfaces/usuario-interface";
import { UsuariosService } from "../../services/usuariosService";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import FormInput from "../../components/FormInput";

interface EditUsuarioModalProps {
  show: boolean;
  usuario: Usuario | null;
  roles: Rol[];
  onClose: () => void;
  onSuccess?: (usuarioActualizado?: Usuario) => void;
}

function EditUsuarioModal({
  show,
  usuario,
  roles,
  onClose,
  onSuccess,
}: EditUsuarioModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rolId: 0,
  });

  useEffect(() => {
    if (show && usuario) {
      setForm({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: "",
        rolId: usuario.rol ? usuario.rol.id : 0,
      });
      setError(null);
    }
  }, [show, usuario]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usuario) {
      setError("Usuario inválido.");
      return;
    }

    if (!form.nombre || !form.apellido || !form.email || !form.rolId) {
      setError("Nombre, apellido, email y rol son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const payload: {
        nombre: string;
        apellido: string;
        email: string;
        rolId: number;
        password?: string;
      } = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        rolId: Number(form.rolId),
      };
      if (form.password) payload.password = form.password;

      await UsuariosService.actualizarUsuario(usuario.id, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setError(
        (err as any)?.message ||
          "Error al actualizar el usuario. Verificá los datos e intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show || !usuario) return null;

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
          className="modal-dialog modal-xl modal-dialog-centered custom-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content custom-modal-content p-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold ">Editar Usuario</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <p className="text-muted mb-4">
                Modificá los datos del usuario y guardá los cambios.
              </p>

              {error && (
                <ErrorMessage message={error} onRetry={() => setError(null)} />
              )}
              {loading && <LoadingSpinner />}

              {!loading && (
                <div className="card shadow-sm border-0 registrar-card">
                  <div className="card-body px-4 py-3">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <FormInput
                            label="Nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Alejo"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <FormInput
                            label="Apellido"
                            name="apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            placeholder="Ej: De Miguel"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Ej: alejodm@gmail.com"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <FormInput
                            label="Contraseña (dejar vacío para no cambiar)"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres"
                          />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label fw-bold">Rol</label>
                          <select
                            className="form-select"
                            name="rolId"
                            value={form.rolId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccioná un rol</option>
                            {roles.map((rol) => (
                              <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-info text-light fw-bold w-100 mt-4"
                        disabled={loading}
                      >
                        GUARDAR CAMBIOS
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUsuarioModal;
