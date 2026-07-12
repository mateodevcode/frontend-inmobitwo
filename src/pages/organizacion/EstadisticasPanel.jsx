// src/pages/organizacion/EstadisticasPanel.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

const EstadisticasPanel = () => {
  const { id } = useParams();
  const { cargarEstadisticasOrganizacion } = useOrganizaciones();

  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      const res = await cargarEstadisticasOrganizacion(id);
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.error || "No se pudieron cargar las estadísticas.");
      }
      setCargando(false);
    };
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (cargando) {
    return (
      <div className="p-6 text-sm text-black/40">Cargando estadísticas...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  const { propiedades, miembros, ultimaPropiedad } = stats;

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Propiedades */}
        <div className="rounded-lg border border-black/10 p-4">
          <h3 className="text-xs uppercase font-semibold text-black/50 mb-3">
            Propiedades
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60">Total</span>
              <span className="font-semibold">{propiedades.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Publicadas</span>
              <span className="font-semibold">{propiedades.publicadas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">No publicadas</span>
              <span className="font-semibold">{propiedades.no_publicadas}</span>
            </div>
          </div>
        </div>

        {/* Miembros */}
        <div className="rounded-lg border border-black/10 p-4">
          <h3 className="text-xs uppercase font-semibold text-black/50 mb-3">
            Equipo
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60">Total</span>
              <span className="font-semibold">{miembros.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Activos</span>
              <span className="font-semibold">{miembros.activos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Administradores</span>
              <span className="font-semibold">{miembros.administradores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Agentes</span>
              <span className="font-semibold">{miembros.agentes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Última propiedad publicada */}
      <div className="mt-4 rounded-lg border border-black/10 p-4">
        <h3 className="text-xs uppercase font-semibold text-black/50 mb-2">
          Última propiedad
        </h3>
        {ultimaPropiedad ? (
          <div className="text-sm">
            <p className="font-medium">
              {ultimaPropiedad.titulo || "Sin título"}
            </p>
            <p className="text-black/50 text-xs mt-0.5">
              {new Date(ultimaPropiedad.created_at).toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-black/40">
            Todavía no hay propiedades publicadas.
          </p>
        )}
      </div>
    </div>
  );
};

export default EstadisticasPanel;
