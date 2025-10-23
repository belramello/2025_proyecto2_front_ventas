import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarcasService } from "../../services/marcasService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import "./FormularioMarca.css"; 

const FormularioMarca = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [marcaData, setMarcaData] = useState({
    nombre: "",
    descripcion: "",
    logo: null as File | null,
  });
  const [logoFileName, setLogoFileName] = useState("Ningún archivo seleccionado");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMarcaData({ ...marcaData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMarcaData({ ...marcaData, logo: file });
      setLogoFileName(file.name);
    }
  };

  const submitForm = async () => {
    if (!marcaData.logo) {
      setError("El logo es requerido.");
      return;
    }
    if (!marcaData.nombre) {
      setError("El nombre es requerido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await MarcasService.createMarca({
        nombre: marcaData.nombre,
        descripcion: marcaData.descripcion,
        logo: marcaData.logo,
      });
      alert("¡Marca creada con éxito!");
      navigate("/marcas");
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error al crear la marca. Verificá los datos.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const handleRetry = () => {
    submitForm();
  };

  return (
    <div className="form-container" style={{ margin: "40px auto" }}>
      <h1>AGREGAR MARCA</h1>
      <p className="text-center text-muted mb-4" style={{ marginTop: "-20px" }}>
        Completá los datos para registrar una nueva marca.
      </p>

      <form className="product-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Nombre de la Marca</label>
          <input
            type="text"
            name="nombre"
            placeholder="Escribe el nombre de la marca"
            value={marcaData.nombre}      
            onChange={handleInputChange} 
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            placeholder="Escribe la descripción de la marca"
            value={marcaData.descripcion} 
            onChange={handleInputChange} 
          ></textarea>
        </div>

        <div className="form-group">
          <label className="fw-bold">Logo</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/png, image/jpeg, image/webp"
              className="file-input-hidden"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="logo" className="btn teal" style={{ margin: 0 }}>
              Seleccionar archivo...
            </label>
            <span className="file-input-filename">{logoFileName}</span>
          </div>
          {error && error.includes("logo") && (
              <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                {error}
              </div>
          )}
        </div>

        <div className="form-actions">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button type="submit" className="btn green">GUARDAR MARCA</button>
          )}
        </div>
        
        {error && !error.includes("logo") && (
          <div className="mt-3">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioMarca;