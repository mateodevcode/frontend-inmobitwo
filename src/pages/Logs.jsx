// src/pages/Logs.jsx
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useLogsTracking from "@/hooks/useLogsTracking";
import { LuRefreshCw, LuPause, LuPlay } from "react-icons/lu";

const COLOR_POR_TIPO = {
  sesion: "text-blue-400",
  evento: "text-gray-200",
  lead: "text-yellow-300 font-semibold",
};

const formatearHora = (fecha) =>
  new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Logs = () => {
  const { logsTracking, loadingLogsTracking } = useAppContext();
  const { cargarLogsTracking } = useLogsTracking();
  const cargaInicialHecha = useRef(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervaloRef = useRef(null);

  // Carga inicial
  useEffect(() => {
    if (cargaInicialHecha.current) return;
    cargaInicialHecha.current = true;
    cargarLogsTracking();
  }, []);

  // Auto-refresh cada 4 segundos, sin mostrar loading
  useEffect(() => {
    if (autoRefresh) {
      intervaloRef.current = setInterval(() => {
        cargarLogsTracking(false);
      }, 4000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [autoRefresh]);

  const renderLinea = (log) => {
    const hora = formatearHora(log.created_at);

    if (log.tipo === "sesion") {
      return (
        <div key={log.id} className={COLOR_POR_TIPO.sesion}>
          <span className="text-gray-500">[{hora}]</span> 🆕 {log.quien}{" "}
          {log.mensaje}
        </div>
      );
    }

    if (log.tipo === "evento") {
      return (
        <div key={log.id} className={COLOR_POR_TIPO.evento}>
          <span className="text-gray-500">[{hora}]</span> {log.emoji}{" "}
          {log.quien} {log.mensaje}
        </div>
      );
    }

    if (log.tipo === "lead") {
      return (
        <div key={log.id} className={COLOR_POR_TIPO.lead}>
          <span className="text-gray-500">[{hora}]</span> 🎯 {log.mensaje}
        </div>
      );
    }

    return null;
  };

  return (
    <main className="w-full md:px-6 pb-10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Logs de trazabilidad</h1>
          <p className="text-black/60 text-sm">
            Actividad en vivo del sistema de tracking y leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh((prev) => !prev)}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-black/20 hover:bg-black/5 transition"
          >
            {autoRefresh ? <LuPause size={14} /> : <LuPlay size={14} />}
            {autoRefresh ? "Pausar" : "Reanudar"}
          </button>
          <button
            onClick={() => cargarLogsTracking()}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-black/80 transition"
          >
            <LuRefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-sm min-h-dvh overflow-y-auto flex flex-col-reverse gap-1.5">
        {/* flex-col-reverse: lo más reciente queda arriba visualmente, pero el orden lógico se mantiene */}
        {loadingLogsTracking ? (
          <div className="text-gray-400">Cargando actividad...</div>
        ) : logsTracking.length === 0 ? (
          <div className="text-gray-400">
            Aún no hay actividad registrada. Navega el sitio para generar
            eventos.
          </div>
        ) : (
          [...logsTracking].reverse().map(renderLinea)
        )}
      </div>
    </main>
  );
};

export default Logs;
