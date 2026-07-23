import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { apiBackend } from "@/api/apiBackend";
import { BsGeoAlt } from "react-icons/bs";
import ModalSuggestionsMenu from "./ModalSuggestionsMenu";

const InputSearchPrincipal = ({ onGeoSelect, query, setQuery, operation }) => {
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
      const operacionDb = operation === "alquilar" ? "arriendo" : "venta";
      const res = await apiBackend(
        `/api/suggest-cities?q=${encodeURIComponent(text)}&operation=${operacionDb}`,
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
  }, [query, operation]);

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

  const handleSelectResult = (item) => {
    if (item.tipo === "region") {
      setQuery(item.region_name);
      onGeoSelect({ type: "region", regionSlug: item.region_slug });
    } else if (item.tipo === "departamento") {
      setQuery(item.state_name);
      onGeoSelect({ type: "departamento", departmentSlug: item.state_slug });
    } else {
      setQuery(`${item.city_name}, ${item.state_name}`);
      onGeoSelect({
        type: "ciudad",
        citySlug: item.city_slug,
        departmentSlug: item.state_slug,
      });
    }
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
        handleSelectResult(results[activeIndex]);
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
        <ModalSuggestionsMenu setIsOpen={setIsOpen} />
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
            <ul className="">
              {results.map((item, index) => (
                <li key={`${item.tipo}-${item.id}`} ref={(el) => (itemRefs.current[index] = el)}>
                  <button
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex flex-col w-full items-start px-4 py-3 text-left text-sm transition-colors cursor-pointer border-b border-segundo/10 ${
                      activeIndex === index
                        ? "bg-tercero/10 text-black"
                        : "text-black/80 hover:bg-tercero/3"
                    }`}
                  >
                    <span className="font-medium">
                      {item.tipo === "region" && item.region_name}
                      {item.tipo === "departamento" && (
                        <>
                          {item.state_name}
                          {item.region_name && (
                            <span className="text-black/40 font-normal">
                              , {item.region_name}
                            </span>
                          )}
                        </>
                      )}
                      {item.tipo === "ciudad" && (
                        <>
                          {item.city_name}, {item.state_name}
                        </>
                      )}
                    </span>
                    <div className="text-xs text-segundo/60 mt-0.5 flex items-center gap-2 justify-between w-full">
                      <div className="flex items-center gap-2">
                        <BsGeoAlt className="text-sm" />
                        <span className="capitalize">{item.tipo}</span>
                      </div>

                      <span className="font-semibold">
                        {item.total_propiedades}
                      </span>
                    </div>
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
