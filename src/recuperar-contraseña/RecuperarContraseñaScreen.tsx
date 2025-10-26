import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import { UsuariosService } from "../services/usuariosService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RecuperarContraseña.css";

function RecuperarContraseñaScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Por favor completá el email.");
      return;
    }

    setLoading(true);
    try {
      await UsuariosService.forgotPassword({ email });
      setSuccess(
        "El mail fue enviado con éxito. Revisá tu casilla de entrada para continuar con la recuperación de contraseña."
      );
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Error al enviar email de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const onCancelar = () => navigate("/login");

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center vh-100">
      <div className="card auth-card shadow-lg border-0 p-5 text-center">
        <h2 className="fw-bold mb-3 text-dark">Recuperar Contraseña</h2>
        <p className="text-muted small mb-4">
          Ingresá tu correo electrónico. Si el usuario existe, recibirás un mail
          con el enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            name="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="ejemplo@email.com"
            required
            className="text-start mb-3"
          />

          {error && (
            <ErrorMessage message={error} onRetry={() => setError("")} />
          )}
          {success && (
            <div className="alert alert-success text-center mt-3 p-2 rounded-3">
              {success}
            </div>
          )}

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary flex-grow-1 rounded-pill"
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 rounded-pill"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarContraseñaScreen;
