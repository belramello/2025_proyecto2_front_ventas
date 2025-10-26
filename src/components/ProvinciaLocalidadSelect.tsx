import React, { useEffect, useState } from "react";

interface Localidad {
  id_localidad: string;
  nombre: string;
  id_provincia: string;
}

interface Provincia {
  id: string;
  nombre: string;
}

interface Props {
  onChange: (provincia: string, localidad: string) => void;
}

const SelectProvinciaLocalidad: React.FC<Props> = ({ onChange }) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("");

  useEffect(() => {
    fetch("/provincias.json")
      .then((res) => res.json())
      .then((data) => setProvincias(data));
  }, []);

  useEffect(() => {
    fetch("/loc.json")
      .then((res) => res.json())
      .then((data) => setLocalidades(data));
  }, []);

  useEffect(() => {
    onChange(provinciaSeleccionada, localidadSeleccionada);
  }, [provinciaSeleccionada, localidadSeleccionada, onChange]);

  const provinciaActual = provincias.find((p) => p.nombre === provinciaSeleccionada);
  const localidadesFiltradas = localidades.filter(
    (loc) => loc.id_provincia === provinciaActual?.id
  );

  return (
    <>
      <div className="mb-3">
        <label htmlFor="provincia" className="form-label">
          Provincia
        </label>
        <select
          id="provincia"
          className="form-control"
          value={provinciaSeleccionada}
          onChange={(e) => {
            setProvinciaSeleccionada(e.target.value);
            setLocalidadSeleccionada("");
          }}
          required
        >
          <option value="">Seleccionar una Provincia</option>
          {provincias.map((prov) => (
            <option key={prov.id} value={prov.nombre}>
              {prov.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="localidad" className="form-label">
          Localidad
        </label>
        <select
          id="localidad"
          className="form-control"
          value={localidadSeleccionada}
          onChange={(e) => setLocalidadSeleccionada(e.target.value)}
          disabled={!provinciaSeleccionada}
          required
        >
          <option value="">Seleccionar una Localidad</option>
          {localidadesFiltradas.map((loc) => (
            <option key={loc.id_localidad} value={loc.nombre}>
              {loc.nombre}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SelectProvinciaLocalidad;
