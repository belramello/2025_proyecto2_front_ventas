import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updatePermisosRol,
  getRolById,
  findAllPermisos,
} from "../../services/rolesService";
import type { Permiso } from "../interfaces/permiso-interface";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { RespuestaFindOneRol } from "../interfaces/find-one-rol.interface";
import "./ModificarPermisosScreen.css";
import { CategoriaCard } from "../components/CategoriaCard";

export default function ModificarPermisosScreen() {
  const { id } = useParams<{ id: string }>();
  const rolId = Number(id || 0);
  const navigate = useNavigate();

  const [rol, setRol] = useState<RespuestaFindOneRol | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [rolResponse, permisosResponse] = await Promise.all([
          getRolById(rolId),
          findAllPermisos(),
        ]);
        setRol(rolResponse);
        setPermisos(permisosResponse || []);
        setSelected(new Set(rolResponse.permisos.map((p) => p.id)));
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los datos del rol y permisos.");
      } finally {
        setLoading(false);
      }
    };

    if (rolId) cargarDatos();
  }, [rolId]);

  const permisosPorCategoria = useMemo(() => {
    const map = new Map<string, Permiso[]>();
    permisos.forEach((p) => {
      const cat = p.categoria || "Otros";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    });
    return Array.from(map.entries());
  }, [permisos]);

  const togglePermiso = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!rol) return;
    try {
      setSaving(true);
      await updatePermisosRol(rol.id, Array.from(selected));
      navigate(-1);
    } catch {
      setError("Error al actualizar permisos. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!rol)
    return (
      <ErrorMessage message="Rol no encontrado" onRetry={() => navigate(-1)} />
    );

  return (
    <div className="container py-4 animate__animated animate__fadeIn">
      <div className="mb-4 text-center">
        <h3 className="fw-bold">{rol.nombre}</h3>
        <p className="text-muted small mb-0">
          {rol.descripcion || "Sin descripción"}
        </p>
      </div>

      <div className="row g-4">
        {permisosPorCategoria.map(([categoria, lista]) => (
          <CategoriaCard
            key={categoria}
            categoria={categoria}
            permisos={lista}
            selected={selected}
            onToggle={togglePermiso}
          />
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          className="btn btn-primary px-4"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>
    </div>
  );
}
