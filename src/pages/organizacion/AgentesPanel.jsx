// src/pages/organizacion/AgentesPanel.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

const AgentesPanel = () => {
  const { organizaciones } = useAppContext();
  const {
    cargarMiembros,
    crearMiembroOrganizacion,
    actualizarMiembroOrganizacion,
    eliminarMiembroOrganizacion,
  } = useOrganizaciones();

  const organizacion = organizaciones[0];
  const esAdmin = organizacion?.rol_en_org === "agency_admin";

  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailNuevo, setEmailNuevo] = useState("");
  const [rolNuevo, setRolNuevo] = useState("agent");
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    if (!organizacion) return;
    setLoading(true);
    const res = await cargarMiembros(organizacion.id);
    if (res.success) setMiembros(res.data);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizacion?.id]);

  if (!organizacion) return null;

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!emailNuevo.trim()) {
      toast.error("Escribe un email", { position: "bottom-right" });
      return;
    }

    setEnviando(true);
    const res = await crearMiembroOrganizacion(
      organizacion.id,
      emailNuevo.trim().toLowerCase(),
      rolNuevo,
    );
    setEnviando(false);

    if (res.success) {
      toast.success(res.message, { position: "bottom-right" });
      setEmailNuevo("");
      setRolNuevo("agent");
      cargar();
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  const handleCambiarRol = async (miembroId, nuevoRol) => {
    const res = await actualizarMiembroOrganizacion(miembroId, {
      rol_en_org: nuevoRol,
    });
    if (res.success) {
      toast.success("Rol actualizado", { position: "bottom-right" });
      cargar();
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  const handleCambiarEstado = async (miembroId, nuevoEstado) => {
    const res = await actualizarMiembroOrganizacion(miembroId, {
      estado: nuevoEstado,
    });
    if (res.success) {
      toast.success(
        nuevoEstado === "activo" ? "Agente reactivado" : "Agente suspendido",
        { position: "bottom-right" },
      );
      cargar();
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  const handleEliminar = async (miembroId) => {
    const res = await eliminarMiembroOrganizacion(miembroId);
    if (res.success) {
      toast.success("Agente eliminado", { position: "bottom-right" });
      cargar();
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-bold">Agentes de {organizacion.nombre}</h2>

      {esAdmin && (
        <form
          onSubmit={handleAgregar}
          className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
        >
          <input
            value={emailNuevo}
            onChange={(e) => setEmailNuevo(e.target.value)}
            placeholder="Email del agente (debe estar ya registrado)"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <select
            value={rolNuevo}
            onChange={(e) => setRolNuevo(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="agent">Agente</option>
            <option value="agency_admin">Administrador</option>
          </select>
          <button
            type="submit"
            disabled={enviando}
            className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {enviando ? "Agregando..." : "Agregar"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-black/50">Cargando agentes...</p>
      ) : miembros.length === 0 ? (
        <p className="text-sm text-black/50">Todavía no hay agentes.</p>
      ) : (
        <div className="space-y-2">
          {miembros.map((m) => (
            <div
              key={m.id}
              className="border rounded-xl p-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {m.image_url ? (
                  <img
                    src={m.image_url}
                    alt={m.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-200" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-black/50 truncate">{m.email}</p>
                </div>
              </div>

              {esAdmin ? (
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={m.rol_en_org}
                    onChange={(e) => handleCambiarRol(m.id, e.target.value)}
                    className="text-sm border rounded-lg px-2 py-1"
                  >
                    <option value="agent">Agente</option>
                    <option value="agency_admin">Administrador</option>
                  </select>

                  {m.estado === "activo" ? (
                    <button
                      onClick={() => handleCambiarEstado(m.id, "suspendido")}
                      className="text-xs px-3 py-1 rounded-lg bg-yellow-500 text-white"
                    >
                      Suspender
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCambiarEstado(m.id, "activo")}
                      className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white"
                    >
                      Reactivar
                    </button>
                  )}

                  <button
                    onClick={() => handleEliminar(m.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <span className="text-xs text-black/50 capitalize shrink-0">
                  {m.rol_en_org === "agency_admin" ? "Administrador" : "Agente"}
                  {" · "}
                  {m.estado}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentesPanel;
