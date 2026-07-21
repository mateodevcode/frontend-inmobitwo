import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { SiOpenstreetmap } from "react-icons/si";
import { FaDrawPolygon } from "react-icons/fa";
import { IoMdLocate } from "react-icons/io";

const SUGGESTIONS = [
  {
    id: "select-zone",
    label: "Seleccionar zonas en mapa",
    icon: SiOpenstreetmap,
    route: "/hola",
  },
  {
    id: "draw-zone",
    label: "Dibujar tu zona",
    icon: FaDrawPolygon,
    route: "/hola",
  },
  {
    id: "around-me",
    label: "Buscar a tu alrededor",
    icon: IoMdLocate,
    route: "/hola",
  },
];

const InputSearchPrincipal = ({ onGeoSelect }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 1. Interceptar el texto que escribe el usuario para cambiar los slugs dinámicamente
  useEffect(() => {
    const text = query.toLowerCase().trim();
    if (text.length < 3) return;

    // Validación local temporal (Pronto lo conectaremos a tu base de datos de 9,527 ciudades)
    if (text.includes("barranquilla")) {
      onGeoSelect({ citySlug: "barranquilla", departmentSlug: "atlantico" });
    } else if (text.includes("medellin")) {
      onGeoSelect({ citySlug: "medellin", departmentSlug: "antioquia" });
    } else if (text.includes("cali")) {
      onGeoSelect({ citySlug: "santiago-de-cali", departmentSlug: "valle" });
    } else if (text.includes("bogota")) {
      onGeoSelect({ citySlug: "bogota", departmentSlug: "dc" });
    }
  }, [query, onGeoSelect]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex-1 md:min-w-55">
      <div className="flex items-center gap-2 h-11 px-4 bg-white border border-black/10">
        <IoSearchOutline className="text-black/40 text-lg shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe dónde buscas"
          className="w-full md:h-full outline-none text-sm placeholder:text-black/40 h-11 bg-transparent"
        />
      </div>

      {isOpen && query.trim() === "" && (
        <div className="absolute z-50 left-0 right-0 -mt-0.5 bg-white border border-black/10 shadow-lg">
          <ul className="py-1">
            {SUGGESTIONS.map(({ id, label, icon: Icon, route }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate(route);
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
      )}
    </div>
  );
};

export default InputSearchPrincipal;
