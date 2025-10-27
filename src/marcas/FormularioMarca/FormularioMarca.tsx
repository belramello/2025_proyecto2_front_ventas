import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Select from "react-select";
import { MarcasService } from "../../services/marcasService";
import { LineasService } from "../../services/lineasService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import "./FormularioMarca.css";
import { BsArrowLeft, BsTrash } from "react-icons/bs";
import type { Marca } from "../interfaces/marca.interface";
import type { Linea } from "../../lineas/interfaces/lineas-interface";
import type { UpdateMarcaData } from "../interfaces/update-marca-data.interface";

interface SelectOption {
  value: number;
  label: string;
}

const FormularioMarca = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState(
    "Ningún archivo seleccionado"
  );
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allLineas, setAllLineas] = useState<SelectOption[]>([]);
  const [selectedLineas, setSelectedLineas] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoadingInitialData(true);
    setError(null);
    LineasService.findAll()
      .then((lineasData) => {
        if (!isMounted) return;
        const options = Array.isArray(lineasData)
          ? lineasData.map((linea: Linea) => ({
              value: linea.id,
              label: linea.nombre,
            }))
          : lineasData.lineas.map((linea: Linea) => ({
              value: linea.id,
              label: linea.nombre,
            }));
        setAllLineas(options);
        if (!isEditing) setLoadingInitialData(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error al cargar líneas:", err);
        setError("No se pudieron cargar las líneas disponibles.");
        setLoadingInitialData(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isEditing]);

  useEffect(() => {
    let isMounted = true;

    if (isEditing && id && allLineas.length > 0 && loadingInitialData) {
      MarcasService.getMarcaById(Number(id))
        .then((marca: Marca) => {
          if (!isMounted) return;
          setNombre(marca.nombre);
          setDescripcion(marca.descripcion || "");
          setExistingLogoUrl(marca.logoUrl);
          setPreviewUrl(marca.logoUrl);
          setLogoFileName(
            marca.logoUrl
              ? "Logo actual cargado"
              : "Ningún archivo seleccionado"
          );

          if (marca.lineas && Array.isArray(marca.lineas)) {
            const lineasSeleccionadas = allLineas.filter((option) =>
              marca.lineas?.some(
                (lineaAsociada) => lineaAsociada.id === option.value
              )
            );
            setSelectedLineas(lineasSeleccionadas);
          }
          setLoadingInitialData(false);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("Error al cargar la marca para editar:", err);
          setError("Error al cargar los datos de la marca para editar.");
          setLoadingInitialData(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, isEditing, allLineas, loadingInitialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "nombre") setNombre(value);
    if (name === "descripcion") setDescripcion(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoFileName(file.name);
      setExistingLogoUrl(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else handleRemoveLogo();
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(isEditing ? existingLogoUrl : null);
    setLogoFileName(
      isEditing && existingLogoUrl
        ? "Logo actual cargado"
        : "Ningún archivo seleccionado"
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLineasChange = (
    selectedOptions: readonly SelectOption[] | null
  ) => {
    setSelectedLineas(selectedOptions ? [...selectedOptions] : []);
  };

  const submitForm = async () => {
    if (!nombre) {
      setError("El nombre es requerido.");
      return;
    }
    if (!isEditing && !logoFile) {
      setError("El logo es requerido.");
      return;
    }
    if (selectedLineas.length === 0) {
      setError("Debes seleccionar al menos una línea.");
      return;
    }
    console.log("selectedLineas", selectedLineas);

    setLoading(true);
    setError(null);

    const lineasIdSeleccionadas = selectedLineas.map((option) => option.value);
    const dataToSend: UpdateMarcaData = {
      nombre,
      descripcion,
      lineasId: lineasIdSeleccionadas,
    };
    if (logoFile) dataToSend.logo = logoFile;

    try {
      if (isEditing && id) {
        await MarcasService.updateMarca(Number(id), dataToSend);
        alert("¡Marca actualizada con éxito!");
      } else {
        await MarcasService.createMarca({
          nombre,
          descripcion,
          logo: logoFile!,
          lineasId: lineasIdSeleccionadas,
        });
        alert("¡Marca creada con éxito!");
      }
      navigate("/marcas");
    } catch (err: any) {
      console.error("Error al guardar:", err);
      const responseError = err.response?.data?.message;
      const errorMsg = Array.isArray(responseError)
        ? responseError.join(", ")
        : responseError ||
          `Error al ${isEditing ? "actualizar" : "crear"} la marca.`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (loadingInitialData) return <LoadingSpinner />;

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <div className="card shadow-sm border-0 form-container-card">
            <div className="card-body p-4 p-md-5">
              <Link
                to="/marcas"
                className="btn btn-link mb-3 ps-0 text-decoration-none d-inline-flex align-items-center"
              >
                <BsArrowLeft className="me-2" /> Volver a Marcas
              </Link>

              <h1 className="text-center fw-bold mb-4">
                {isEditing ? "EDITAR MARCA" : "AGREGAR MARCA"}
              </h1>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-4">
                  <div className="col-md-7 d-flex flex-column">
                    <div className="form-group mb-3">
                      <label htmlFor="nombre" className="form-label fw-bold">
                        Nombre
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        placeholder="Escribe el nombre"
                        className={`form-control ${
                          error?.includes("nombre") ||
                          error?.includes("registrado")
                            ? "is-invalid"
                            : ""
                        }`}
                        value={nombre}
                        onChange={handleInputChange}
                        required
                      />
                      {error &&
                        (error.includes("nombre") ||
                          error.includes("registrado")) && (
                          <div className="invalid-feedback d-block">
                            {error}
                          </div>
                        )}
                    </div>

                    <div className="form-group mb-3 flex-grow-1">
                      <label
                        htmlFor="descripcion"
                        className="form-label fw-bold"
                      >
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        placeholder="Escribe la descripción"
                        className="form-control"
                        style={{ height: "100px", minHeight: "100px" }}
                        value={descripcion}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="lineas" className="form-label fw-bold">
                        Líneas Asociadas
                      </label>
                      <Select
                        id="lineas"
                        isMulti
                        name="lineas"
                        options={allLineas}
                        classNamePrefix="select"
                        placeholder="Selecciona líneas..."
                        value={selectedLineas}
                        onChange={handleLineasChange}
                        isLoading={loadingInitialData && allLineas.length === 0}
                        closeMenuOnSelect={false}
                        noOptionsMessage={() => "No hay líneas disponibles"}
                      />
                      {error && error.includes("línea") && (
                        <div className="invalid-feedback d-block">{error}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5 d-flex flex-column align-items-center justify-content-center logo-section">
                    <label className="fw-bold mb-2">Logo</label>
                    <div className="logo-preview-container mb-3">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Previsualización logo"
                          className="logo-preview-image"
                        />
                      ) : (
                        <div className="logo-placeholder">Sin logo</div>
                      )}
                    </div>

                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />

                    <label htmlFor="logo" className="btn btn-teal mb-2">
                      {isEditing ? "Cambiar logo..." : "Agregar Imagen"}
                    </label>

                    <span className="file-input-filename mb-2">
                      {logoFileName}
                    </span>

                    {(logoFile || existingLogoUrl) && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <BsTrash className="me-1" /> Quitar Imagen
                      </button>
                    )}

                    {error && error.includes("logo") && (
                      <div className="text-danger small mt-1">{error}</div>
                    )}
                  </div>
                </div>

                <div className="form-actions mt-4">
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit" className="btn btn-success px-4">
                      {isEditing ? "GUARDAR CAMBIOS" : "GUARDAR MARCA"}
                    </button>
                  )}
                </div>

                {error &&
                  !error.includes("logo") &&
                  !error.includes("línea") &&
                  !error.includes("nombre") && (
                    <div className="mt-3">
                      <ErrorMessage message={error} onRetry={submitForm} />
                    </div>
                  )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioMarca;
