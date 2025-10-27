import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProveedoresService } from "../services/proveedoresService";
import SelectProvinciaLocalidad from "../components/ProvinciaLocalidadSelect";
import "./AgregarProveedorScreen.css";
import ActionButton2 from "../components/Button2";
import { BsArrowLeft } from "react-icons/bs";
import { PermissionGuard } from "../auth/guards/permisos-guard";
import { Permisos } from "../auth/enums/permisos";

const AgregarProveedorScreen: React.FC = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUbicacionChange = (prov: string, loc: string) => {
    setProvincia(prov);
    setLocalidad(loc);
  };

  const registrarProveedor = async () => {
    setError(null);

    if (!nombre || !direccion || !email || !contacto) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (!provincia || !localidad) {
      setError("Seleccioná una provincia y localidad.");
      return;
    }

    const direccionValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+ \d{1,5}$/.test(
      direccion.trim()
    );
    if (!direccionValida) {
      setError("Ingresá una dirección válida (ejemplo: Alvear 1345).");
      return;
    }

    const contactoValido = /^\d+$/.test(contacto.trim());
    if (!contactoValido) {
      setError("El contacto debe contener solo números (ejemplo: 36373847).");
      return;
    }

    const dto = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      email: email.trim(),
      contacto: contacto.trim(),
      provincia,
      localidad,
    };

    setLoading(true);
    try {
      await ProveedoresService.registrarProveedor(dto);
      navigate("/proveedores");
    } catch (err: any) {
      console.error("Error registrarProveedor:", err);
      setError(
        err?.message || "No se pudo registrar el proveedor. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionGuard requiredPermissions={Permisos.CREAR_PROVEEDOR}>
      <div className="container mt-4">
        <h3 className="mb-3 text-center">PROVEEDOR</h3>
        <Link
          to="/proveedores"
          className="btn btn-link ps-0 text-decoration-none text-primary fw-bold"
          style={{ fontSize: "1rem" }}
        >
          <BsArrowLeft className="me-2" />
          Volver a Proveedores
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            registrarProveedor();
          }}
          className="form-proveedor"
        >
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contacto</label>
            <input
              type="text"
              className="form-control"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              required
            />
          </div>

          <SelectProvinciaLocalidad onChange={handleUbicacionChange} />

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <ActionButton2
            label={loading ? "Guardando..." : "GUARDAR"}
            variant="primary"
            type="submit"
            size="lg"
            className="d-block mx-auto mt-4 px-4 py-3 fw-bold"
          />
        </form>
      </div>
    </PermissionGuard>
  );
};

export default AgregarProveedorScreen;
