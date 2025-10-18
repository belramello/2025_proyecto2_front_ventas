import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/context/authContext";
import { loginRequest } from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null; // Manejo del caso donde el contexto no está disponible
  const { login } = auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest({ email, password });
      login(data.usuario.permisos);
      navigate("/inicio");
    } catch (err) {
      setError("Error de autenticación. Por favor, verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Iniciar sesión
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full mb-3 p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full mb-3 p-2 rounded"
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
