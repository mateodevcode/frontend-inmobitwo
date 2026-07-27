// src/features/seleccionar-zona/components/InputSearchZona.jsx
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { BsGeoAlt } from "react-icons/bs";
import { apiBackend } from "@/api/apiBackend.js";
import {
  MAPPING_TIPOS,
  MAPPING_OPERACIONES,
} from "@/data/mappings_busqueda.js";

export default function InputSearchZona({
  onSelectZone,
  operation,
  tipoInmueble,
  className = "",
  showX = true,
}) {
  const [query, setQuery] = useState("");
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
      const operacionDb = MAPPING_OPERACIONES[operation] || operation;
      const typeDb = MAPPING_TIPOS[tipoInmueble] || tipoInmueble;
      const res = await apiBackend(
        `/api/suggest-cities?q=${encodeURIComponent(text)}&operation=${operacionDb}&type=${typeDb}`,
      );
      if (res.success) setResults(res.data || []);
      else setResults([]);
      setActiveIndex(-1);
      setLoading(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, operation, tipoInmueble]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelectResult = (item) => {
    if (item.tipo === "region") {
      setQuery(item.region_name);
      onSelectZone({
        type: "region",
        name: item.region_name,
        slug: item.region_slug,
      });
    } else if (item.tipo === "departamento") {
      setQuery(item.state_name);
      onSelectZone({
        type: "departamento",
        daneCode: item.state_dane_code,
        name: item.state_name,
      });
    } else if (item.tipo === "ciudad") {
      setQuery(`${item.city_name}, ${item.state_name}`);
      onSelectZone({
        type: "municipio",
        daneCode: item.city_dane_code,
        name: item.city_name,
        dptoDaneCode: item.state_dane_code,
      });
    }
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onSelectZone(null, operation, tipoInmueble);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setIsOpen(true);
      setActiveIndex((p) => (p + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setIsOpen(true);
      setActiveIndex((p) => (p - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length === 0) return;
      const idx = activeIndex >= 0 ? activeIndex : 0;
      handleSelectResult(results[idx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className || "max-w-md"}`}>
      <div className="flex items-center gap-2 border-black py-2.5 px-4 rounded-sm bg-white">
        <FiSearch className="text-black/60 shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Barrio, ciudad, municipio"
          className="w-full text-sm bg-transparent outline-none placeholder:text-black/60"
        />
        {showX && query && (
          <button
            onClick={handleClear}
            className="shrink-0 text-white bg-black rounded-full hover:bg-black/80 cursor-pointer absolute right-3 p-0.5"
            title="Limpiar"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-sm max-h-64 overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">Buscando...</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Sin coincidencias</p>
          )}
          {!loading &&
            results.map((item, i) => (
              <button
                key={`${item.tipo}-${item.id}`}
                ref={(el) => (itemRefs.current[i] = el)}
                type="button"
                onClick={() => handleSelectResult(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex flex-col w-full items-start px-4 py-3 text-left text-sm transition-colors cursor-pointer border-b border-gray-100 ${
                  activeIndex === i
                    ? "bg-pink-50 text-black"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">
                  {item.tipo === "region" && item.region_name}
                  {item.tipo === "departamento" && (
                    <>
                      {item.state_name}
                      {item.region_name && (
                        <span className="text-gray-400 font-normal">
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
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 justify-between w-full">
                  <div className="flex items-center gap-1">
                    <BsGeoAlt className="text-xs" />
                    <span className="capitalize">{item.tipo}</span>
                  </div>
                  <span className="font-semibold">
                    {item.total_propiedades}
                  </span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
