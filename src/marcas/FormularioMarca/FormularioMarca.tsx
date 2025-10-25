import React, { useState, useEffect } from "react"; // Importar useEffect
import { useNavigate, useParams, Link } from "react-router-dom"; // Importar useParams y Link
import { MarcasService } from "../../services/marcasService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import "./FormularioMarca.css";
import { BsArrowLeft } from "react-icons/bs";
import type { Marca } from "../interfaces/marca.interface"; // Importar interfaz Marca

// Interfaz para el estado de los datos de texto
interface MarcaFormDataState {
  nombre: string;
  descripcion: string;
}

const FormularioMarca = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const isEditing = Boolean(id); // Determinar si estamos editando

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado SOLO para nombre y descripción
  const [marcaData, setMarcaData] = useState<MarcaFormDataState>({
    nombre: "",
    descripcion: "",
  });

  // Estados separados para el logo
  const [logoFile, setLogoFile] = useState<File | null>(null); // Archivo nuevo seleccionado
  const [logoFileName, setLogoFileName] = useState("Ningún archivo seleccionado");
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null); // URL del logo actual al editar

  // --- Cargar datos si estamos editando ---
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      MarcasService.getMarcaById(Number(id))
        .then((marca: Marca) => {
          setMarcaData({
            nombre: marca.nombre,
            descripcion: marca.descripcion || "",
          });
          setExistingLogoUrl(marca.logoUrl); // Guardamos la URL del logo actual
          setLogoFileName(marca.logoUrl ? "Logo actual cargado" : "Ningún archivo seleccionado");
        })
        .catch((err) => {
          console.error("Error al cargar la marca para editar:", err);
          setError("Error al cargar la marca para editar.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);
  // ----------------------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMarcaData((prevData) => ({ ...prevData, [name]: value })); // Usar función para estado seguro
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file); // Actualiza el estado del ARCHIVO NUEVO
      setLogoFileName(file.name);
      setExistingLogoUrl(null); // Ocultamos el logo viejo si se selecciona uno nuevo
    }
  };

  // Lógica de envío (Crear o Actualizar)
  const submitForm = async () => {
     if (!marcaData.nombre) {
       setError("El nombre es requerido.");
       return;
     }
     // Logo requerido solo al CREAR
     if (!isEditing && !logoFile) {
        setError("El logo es requerido.");
        return;
     }

    setLoading(true);
    setError(null);

    // Datos a enviar (solo los que tienen valor)
    const dataToSend: { nombre?: string; descripcion?: string; logo?: File | null } = {
        nombre: marcaData.nombre,
        descripcion: marcaData.descripcion,
    };
    // Agregamos el logo solo si se seleccionó uno nuevo
    if (logoFile) {
        dataToSend.logo = logoFile;
    }

    try {
      if (isEditing && id) {
        // --- Llamada a Actualizar ---
        await MarcasService.updateMarca(Number(id), dataToSend);
        alert("¡Marca actualizada con éxito!");
      } else {
        // --- Llamada a Crear ---
        if (!logoFile) throw new Error("Logo no seleccionado para crear."); // Seguridad
        await MarcasService.createMarca({
            nombre: marcaData.nombre,
            descripcion: marcaData.descripcion,
            logo: logoFile, // Usamos logoFile aquí
        });
        alert("¡Marca creada con éxito!");
      }
      navigate("/marcas");
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la marca. Verificá los datos.`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const handleRetry = () => {
    submitForm();
  };

  // Muestra spinner si está cargando datos iniciales
  if (loading && isEditing && !marcaData.nombre) {
      return <LoadingSpinner />;
  }

  return (
    <div className="form-container" style={{ margin: "40px auto" }}>

      {/* Botón Volver (ya lo tenías) */}
      <Link to="/marcas" className="btn btn-link mb-3 align-self-start ps-0 text-decoration-none">
        <BsArrowLeft className="me-2" />
        Volver a Marcas
      </Link>

      {/* Título dinámico */}
      <h1>{isEditing ? "EDITAR MARCA" : "AGREGAR MARCA"}</h1>
      <p className="text-center text-muted mb-4 mt-n3">
        {isEditing ? "Modificá los datos de la marca." : "Completá los datos para registrar una nueva marca."}
      </p>

      <form className="product-form" onSubmit={handleSubmit}>

        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Marca</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Escribe el nombre de la marca"
            value={marcaData.nombre}
            onChange={handleInputChange}
            required
            aria-invalid={error?.includes("nombre") ? "true" : "false"}
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Escribe la descripción de la marca"
            value={marcaData.descripcion}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Logo */}
        <div className="form-group">
          <label className="fw-bold" htmlFor="logo">Logo</label>
          {/* Muestra logo actual si estamos editando y no se seleccionó uno nuevo */}
          {isEditing && existingLogoUrl && (
            <img src={existingLogoUrl} alt="Logo actual" className="logo-preview mb-2"/>
          )}
          <div className="file-input-wrapper">
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*" // Acepta cualquier imagen
              className="file-input-hidden"
              onChange={handleFileChange}
              required={!isEditing} // Requerido solo al CREAR
              aria-invalid={error?.includes("logo") ? "true" : "false"}
            />
            <label htmlFor="logo" className="btn teal m-0">
              {/* Texto dinámico del botón */}
              {isEditing ? (logoFile ? "Cambiar logo..." : "Mantener logo actual / Cambiar...") : "Seleccionar archivo..."}
            </label>
            <span className="file-input-filename">{logoFileName}</span>
          </div>
          {/* Error del logo */}
          {error && error.includes("logo") && (
              <div className="text-danger small mt-1">{error}</div>
          )}
        </div>

        {/* Botón de Guardar */}
        <div className="form-actions">
          {loading ? <LoadingSpinner /> : (
            // Texto dinámico del botón
            <button type="submit" className="btn green">
              {isEditing ? "GUARDAR CAMBIOS" : "GUARDAR MARCA"}
            </button>
          )}
        </div>

        {/* Error general */}
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