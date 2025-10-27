import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ResetPasswordDto } from "./interfaces/reset-password.dto";
import { UsuariosService } from "../services/usuariosService";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RecuperarContraseña.css";

function ResetContraseñaScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido. Volvé a solicitar el cambio de contraseña.");
      return;
    }

    if (!newPassword || !confirmarContraseña) {
      setError("Por favor completá todos los campos.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const resetPasswordDto: ResetPasswordDto = {
        token,
        newPassword,
      };
      await UsuariosService.resetPassword(resetPasswordDto);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center vh-100">
      <div className="card auth-card shadow-lg border-0 p-5 text-center">
        <h2 className="fw-bold mb-3 text-dark">Restablecer Contraseña</h2>
        <p className="text-muted small mb-4">
          Ingresá una nueva contraseña para tu cuenta.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            name="Nueva Contraseña"
            label="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="text-start mb-3"
          />

          <FormInput
            name="Confirmar Contraseña"
            label="Confirmar Contraseña"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="text-start mb-3"
          />

          {error && (
            <ErrorMessage message={error} onRetry={() => setError("")} />
          )}

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary flex-grow-1 rounded-pill"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 rounded-pill"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetContraseñaScreen;
