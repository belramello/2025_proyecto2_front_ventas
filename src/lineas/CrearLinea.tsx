import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LineasService } from "../services/lineasService";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import "./CrearLinea.css";
import { BsArrowLeft } from "react-icons/bs";

interface LineaFormData {
  nombre: string;
  descripcion: string;
}

const CrearLinea = () => {
  const navigate = useNavigate();
  const [lineaData, setLineaData] = useState<LineaFormData>({
    nombre: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLineaData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    if (!lineaData.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await LineasService.registrarLineas({
        nombre: lineaData.nombre,
        descripcion: lineaData.descripcion,
      });

      navigate("/lineas");
    } catch (err: any) {
      console.error("Error al crear línea:", err);
      const msg = err.response?.data?.message || "Error al crear la línea. Verificá los datos.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div className="form-container" style={{ margin: "40px auto" }}>
      <h1>CREAR LÍNEA</h1>
      <p className="text-center text-muted mb-4 mt-n3">
        Completá los datos para registrar una nueva línea.
      </p>
      <Link to="/lineas" className="btn btn-link ps-0 text-decoration-none text-primary fw-bold" style={{ fontSize: "1rem" }}><BsArrowLeft className="me-2" />Volver </Link>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre de la línea"
            value={lineaData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción de la línea"
            value={lineaData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          {loading ? <LoadingSpinner /> : (
            <button type="submit" className="btn green">
              GUARDAR LÍNEA
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3">
            <ErrorMessage message={error} onRetry={submitForm} />
          </div>
        )}
      </form>
    </div>
  );
};


export default CrearLinea;
