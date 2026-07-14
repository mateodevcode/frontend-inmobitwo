// src/pages/organizacion/TemaSelector.jsx
import { toast } from "sonner";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";
import { TEMAS } from "@/pages/organizacion/temas/temaRegistry.js";

const TemaSelector = ({ organizacion, onCambiado }) => {
  const { actualizarOrganizacion } = useOrganizaciones();

  const elegirTema = async (temaId) => {
    const res = await actualizarOrganizacion(organizacion.id, { tema: temaId });
    if (res.success) {
      toast.success("Diseño actualizado", { position: "bottom-right" });
      onCambiado?.(res.data);
    } else {
      toast.error(res.error || "No se pudo cambiar el diseño", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase text-black/60 mb-3">
        Diseño del escaparate
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(TEMAS).map((tema) => (
          <button
            key={tema.id}
            onClick={() => elegirTema(tema.id)}
            className={`rounded-xl border-2 p-2 text-left transition ${
              organizacion.tema === tema.id
                ? "border-rose-600"
                : "border-black/10 hover:border-black/30"
            }`}
          >
            <div className="w-full h-20 bg-stone-100 rounded-lg mb-2 flex items-center justify-center text-xs text-black/30">
              {tema.thumbnail ? (
                <img
                  src={tema.thumbnail}
                  alt={tema.nombre}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                "sin preview"
              )}
            </div>
            <p className="text-xs font-medium">{tema.nombre}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemaSelector;
