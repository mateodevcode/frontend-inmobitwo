import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { SiOpenstreetmap } from "react-icons/si";
import { FaDrawPolygon } from "react-icons/fa";
import { IoMdLocate } from "react-icons/io";
import { apiBackend } from "@/api/apiBackend";

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

const InputSearchPrincipal = ({ onGeoSelect, query, setQuery }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const text = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.length < 2) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      const res = await apiBackend(
        `/api/suggest-cities?q=${encodeURIComponent(text)}`,
      );

      if (res.success) {
        setResults(res.data || []);
      } else {
        setResults([]);
      }
      setActiveIndex(-1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

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

  // Mantiene visible el ítem activo si la lista tiene scroll
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelectCity = (city) => {
    setQuery(`${city.city_name}, ${city.state_name}`);
    onGeoSelect({
      citySlug: city.city_slug,
      departmentSlug: city.state_slug,
    });
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    onGeoSelect(null);
  };

  const showSuggestionsMenu = query.trim() === "";
  const showResultsMenu = query.trim().length >= 2;

  const handleKeyDown = (e) => {
    if (!showResultsMenu || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelectCity(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 md:min-w-55">
      <div className="flex items-center gap-2 h-11 px-4 bg-white border border-black/10">
        <IoSearchOutline className="text-black/40 text-lg shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe dónde buscas"
          className="w-full md:h-full outline-none text-sm placeholder:text-black/40 h-11 bg-transparent"
        />
      </div>

      {isOpen && showSuggestionsMenu && (
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

      {isOpen && showResultsMenu && (
        <div className="absolute z-50 left-0 right-0 -mt-0.5 bg-white border border-black/10 shadow-lg max-h-64 overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-sm text-black/40">Buscando...</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-black/40">Sin coincidencias</p>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-1">
              {results.map((city, index) => (
                <li key={city.id} ref={(el) => (itemRefs.current[index] = el)}>
                  <button
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                      activeIndex === index
                        ? "bg-tercero/10 text-black"
                        : "text-black/80 hover:bg-tercero/3"
                    }`}
                  >
                    <SiOpenstreetmap className="text-lg text-black/60 shrink-0" />
                    <span>
                      {city.city_name}, {city.state_name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSearchPrincipal;
