import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/context/authContext";
import { loginRequest } from "../services/authService";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginScreen.css";
import ActionButton from "../components/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;
  const { login } = auth;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest({
        email: formData.email,
        password: formData.password,
      });
      login(data.usuario.permisos);
      navigate("/inicio");
    } catch {
      setError("Error de autenticación. Por favor, verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center vh-100">
      <div className="card login-card shadow-lg border-0">
        <div className="card-body p-5 text-center">
          <h2 className="fw-bold mb-3 ">¡Bienvenido!</h2>
          <p className="text-muted mb-4">
            Iniciá sesión para gestionar ventas, stock y administración.
          </p>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              placeholder="ejemplo@correo.com"
              required
              onChange={handleChange}
              className="text-start mb-3"
            />

            <FormInput
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              placeholder="••••••••"
              required
              onChange={handleChange}
              className="text-start mb-3"
            />

            {error && (
              <ErrorMessage message={error} onRetry={() => setError(null)} />
            )}

            <ActionButton
              label={loading ? "Cargando..." : "Ingresar"}
              variant="primary"
              size="lg"
              className="w-100 rounded-pill mt-3"
              onClick={handleSubmit as any}
            />
          </form>

          <div className="mt-4">
            <a href="/forgot-password" className="text-muted small mb-0">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
