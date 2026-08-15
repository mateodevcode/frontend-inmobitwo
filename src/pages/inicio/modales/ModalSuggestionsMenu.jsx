import { SUGGESTIONS } from "@/data/suggestions.search";
import { useNavigate } from "react-router-dom";
import { MAPPING_OPERACIONES } from "@/data/mappings_busqueda";
import { toast } from "sonner";

const ModalSuggestionsMenu = ({ setIsOpen, tab, tipo }) => {
  const navigate = useNavigate();

  const operationSlug = MAPPING_OPERACIONES[tab] || tab;
  const typeSlug = tipo?.slug || "viviendas";

  const buildRoute = (base) => {
    return base
      .replace("/venta-viviendas", `/${operationSlug}-${typeSlug}`)
      .replace("/alquiler-viviendas", `/${operationSlug}-${typeSlug}`);
  };

  const buscarAlrededor = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsOpen(false);
        navigate(
          `/point/${operationSlug}-${typeSlug}/${latitude}/${longitude}/16/mapa-google`,
        );
      },
      (err) => {
        console.error("[ModalSuggestionsMenu] Error geolocalizacion:", err.message);
        toast.error(
          "No pudimos obtener tu ubicación. Activa los permisos de ubicación e intenta de nuevo.",
        );
      },
    );
  };

  return (
    <div className="absolute z-50 left-0 right-0 -mt-0.5 bg-white border border-black/10 shadow-lg">
      <ul className="py-1">
        {SUGGESTIONS.map(({ id, label, icon: Icon, route }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => {
                if (id === "around-me") {
                  buscarAlrededor();
                  return;
                }
                setIsOpen(false);
                navigate(buildRoute(route));
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-black/80 hover:bg-tercero/3 transition-colors cursor-pointer"
            >
              <Icon className="text-lg text-black/60 shrink-0" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModalSuggestionsMenu;
