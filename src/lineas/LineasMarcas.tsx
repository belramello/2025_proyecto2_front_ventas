import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { MarcasService } from "../services/marcasService";
import { LineasService } from "../services/lineasService";
import type { Marca } from "../marcas/interfaces/marca.interface";
import type { Linea } from "./interfaces/lineas-interface";
import "./LineasScreen.css"; // ✅ Importa tu archivo de estilos

const LineasPorMarcaScreen: React.FC = () => {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [todasLineas, setTodasLineas] = useState<Linea[]>([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<number | null>(null);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [marcaConsulta, setMarcaConsulta] = useState<number | null>(null);
  const [lineasConsulta, setLineasConsulta] = useState<Linea[]>([]);
  const [loadingConsulta, setLoadingConsulta] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [marcasRes, lineasRes] = await Promise.all([
          MarcasService.getMarcas(),
          LineasService.getLineas(),
        ]);
        setMarcas(marcasRes.marcas ?? []);
        setTodasLineas(lineasRes.lineas ?? []);
      } catch (err) {
        console.error("Error inicial:", err);
        setError("No se pudieron cargar los datos.");
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const consultarLineas = async () => {
      if (!marcaConsulta) return;
      setLoadingConsulta(true);
      try {
        const data = await LineasService.getLineasPorMarca(marcaConsulta);
        setLineasConsulta(data.lineas ?? []);
      } catch (err) {
        console.error("Error consultando líneas:", err);
        setError("No se pudieron consultar las líneas asociadas.");
      } finally {
        setLoadingConsulta(false);
      }
    };
    consultarLineas();
  }, [marcaConsulta]);

  const handleAsociarMarca = async () => {
    if (!marcaSeleccionada || !lineaSeleccionada) {
      setError("Seleccioná una marca y una línea para asociar.");
      return;
    }

    try {
      setError(null);
      await LineasService.añadirMarca(lineaSeleccionada, marcaSeleccionada);
      navigate("/lineas");
    } catch (err) {
      console.error("Error al asociar marca:", err);
      setError("No se pudo asociar la marca a la línea.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="lineas-header-container">
        <div>
          <h1>Líneas asociadas a marca</h1>
          <p>Gestioná la relación entre marcas y líneas</p>
        </div>
        <Link
          to="/lineas"
          className="btn btn-link ps-0 text-decoration-none text-primary fw-bold"
          style={{ fontSize: "1rem" }}
        >
          <BsArrowLeft />
          Volver
        </Link>
      </div>

      {/* Asociación */}
      <div className="form-container mb-5">
        <h5 className="text-center mb-4">Asociar Marca a Línea</h5>
        <div className="product-form">
          <div className="form-group">
            <label>Seleccionar Marca</label>
            <select
              className="form-control"
              value={marcaSeleccionada ?? ""}
              onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
            >
              <option value="">Seleccioná una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Seleccionar Línea</label>
            <select
              className="form-control"
              value={lineaSeleccionada ?? ""}
              onChange={(e) => setLineaSeleccionada(Number(e.target.value))}
            >
              <option value=""> Seleccioná una línea </option>
              {todasLineas.map((linea) => (
                <option key={linea.id} value={linea.id}>
                  {linea.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              className="btn green"
              onClick={handleAsociarMarca}
              disabled={!marcaSeleccionada || !lineaSeleccionada}
            >
              GUARDAR
            </button>
          </div>
        </div>
      </div>

      {/* Consulta */}
      <div className="form-container">
        <h5 className="text-center mb-4">Ver líneas asociadas a una marca</h5>
        <div className="product-form">
          <div className="form-group">
            <label>Seleccionar Marca</label>
            <select
              className="form-control"
              value={marcaConsulta ?? ""}
              onChange={(e) => setMarcaConsulta(Number(e.target.value))}
            >
              <option value="">Seleccioná una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingConsulta ? (
          <p className="text-center mt-4">Cargando líneas asociadas...</p>
        ) : lineasConsulta.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center mt-4">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {lineasConsulta.map((linea) => (
                  <tr key={linea.id}>
                    <td>{linea.nombre}</td>
                    <td>{linea.descripcion ?? "No presenta descripción"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          marcaConsulta && <p className="text-center mt-4">No hay líneas asociadas a esta marca.</p>
        )}
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default LineasPorMarcaScreen;
