// src/pages/Leads.jsx
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useLeads from "@/hooks/useLeads";
import { LuPhone, LuMail, LuClock } from "react-icons/lu";

const ESTADOS = [
  { valor: "nuevo", label: "Nuevo", color: "bg-blue-100 text-blue-700" },
  {
    valor: "contactado",
    label: "Contactado",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    valor: "en_negociacion",
    label: "En negociación",
    color: "bg-purple-100 text-purple-700",
  },
  { valor: "cerrado", label: "Cerrado", color: "bg-green-100 text-green-700" },
  {
    valor: "descartado",
    label: "Descartado",
    color: "bg-gray-100 text-gray-500",
  },
];

const Leads = () => {
  const { leads, loadingLeads } = useAppContext();
  const { cargarLeads, actualizarEstadoLead } = useLeads();
  const cargaInicialHecha = useRef(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    if (cargaInicialHecha.current) return;
    cargaInicialHecha.current = true;
    cargarLeads();
  }, []);

  const leadsFiltrados =
    filtroEstado === "todos"
      ? leads
      : leads.filter((lead) => lead.estado === filtroEstado);

  const getEstadoInfo = (estado) =>
    ESTADOS.find((e) => e.valor === estado) || ESTADOS[0];

  return (
    <main className="w-11/12 md:w-150 md:px-6 pb-10 pt-4 mx-auto">
      <h1 className="text-2xl font-bold mb-1">Mis leads</h1>
      <p className="text-black/60 text-sm mb-6">
        Personas interesadas en tus propiedades. Contáctalas mientras el interés
        está activo.
      </p>

      {/* Filtro por estado */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          className={`text-sm font-semibold rounded-full px-3 py-1 cursor-pointer select-none active:scale-95 duration-75 transition ${
            filtroEstado === "todos"
              ? "bg-black text-white"
              : "bg-white border border-black/20 text-black"
          }`}
          onClick={() => setFiltroEstado("todos")}
        >
          Todos
        </button>
        {ESTADOS.map((e) => (
          <button
            key={e.valor}
            className={`text-sm font-semibold rounded-full px-3 py-1 cursor-pointer select-none active:scale-95 duration-75 transition ${
              filtroEstado === e.valor
                ? "bg-black text-white"
                : "bg-white border border-black/20 text-black"
            }`}
            onClick={() => setFiltroEstado(e.valor)}
          >
            {e.label}
          </button>
        ))}
      </div>

      {loadingLeads ? (
        <div className="text-center py-20 text-gray-400">Cargando leads...</div>
      ) : leadsFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No hay leads{" "}
          {filtroEstado !== "todos"
            ? `en estado "${getEstadoInfo(filtroEstado).label}"`
            : "todavía"}
          .
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {leadsFiltrados.map((lead) => {
            const estadoInfo = getEstadoInfo(lead.estado);
            return (
              <div
                key={lead.id}
                className="border border-black/10 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-black">
                      {lead.nombre || "Visitante anónimo"}
                    </p>
                    <p className="text-sm text-black/60">
                      Interesado en:{" "}
                      <span className="font-medium">
                        {lead.propiedad_titulo}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${estadoInfo.color}`}
                  >
                    {estadoInfo.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-black/70">
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <LuMail className="text-black/40" /> {lead.email}
                    </a>
                  )}
                  {lead.telefono && (
                    <a
                      href={`tel:${lead.telefono}`}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <LuPhone className="text-black/40" /> {lead.telefono}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <LuClock className="text-black/40" />
                    {new Date(lead.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-xs text-black/40">
                    Puntuación de interés: {lead.score} ·{" "}
                    {lead.origen === "formulario_directo"
                      ? "Formulario directo"
                      : "Comportamiento en el sitio"}
                  </span>

                  <select
                    value={lead.estado}
                    onChange={(e) =>
                      actualizarEstadoLead(lead.id, e.target.value, leads)
                    }
                    className="text-sm border border-black/20 rounded-lg px-2 py-1 cursor-pointer"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.valor} value={e.valor}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Leads;
