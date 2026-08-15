// src/pages/seleccionar-zona/SeleccionarZonaPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { TfiMapAlt } from "react-icons/tfi";
import { PiTrashSimple } from "react-icons/pi";
import { FiSearch, FiX } from "react-icons/fi";
import { useSelectZona } from "@/hooks/useSelectZona";
import { buildSearchUrl } from "./utils/urlBuilder";
import SelectZonaMap from "./components/SelectZonaMap";
import { fetchStatesGeoJSON, fetchInmueblesEnPoligono } from "./api";

import InputSearchZona from "./components/InputSearchZona";

function parseOperationAndType(raw) {
  if (!raw) return { operation: "venta", tipoInmueble: "viviendas" };
  // Primer segmento es la operación, el resto es el tipo (soporta compuestos como "obra-nueva")
  const parts = raw.split("-");
  const operation = parts[0] || "venta";
  const tipoInmueble = parts.slice(1).join("-") || "viviendas";
  return { operation, tipoInmueble };
}

export default function SeleccionarZonaPage() {
  const { operationAndType } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { operation, tipoInmueble } = parseOperationAndType(operationAndType);

  const drawFromUrl = searchParams.get("draw") === "true";

  const {
    selectedZone,
    setSelectedZone: selectZone,
    clearZone,
    propertyCount,
    loading,
  } = useSelectZona();
  const [deptNames, setDeptNames] = useState({});
  const [drawMode, setDrawMode] = useState(drawFromUrl);
  const [customPolygon, setCustomPolygon] = useState(null);
  const [polygonProps, setPolygonProps] = useState([]);
  const [polygonPropCount, setPolygonPropCount] = useState(0);
  const [polygonLoading, setPolygonLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    fetchStatesGeoJSON().then((data) => {
      const map = {};
      data.features?.forEach((f) => {
        map[f.properties.DPTO_CCDGO] = f.properties.DPTO_CNMBR;
      });
      setDeptNames(map);
    });
  }, []);

  const handleSelectZone = (zone, op, tipo) => {
    selectZone(zone, op, tipo);
  };

  const handlePolygonChange = useCallback(
    async (geojson) => {
      if (!geojson) {
        setCustomPolygon(null);
        setPolygonProps([]);
        setPolygonPropCount(0);
        return;
      }
      setCustomPolygon(geojson);
      setPolygonLoading(true);
      try {
        const result = await fetchInmueblesEnPoligono(
          geojson,
          operation,
          tipoInmueble,
        );
        setPolygonPropCount(result.total || 0);
        setPolygonProps(result.propiedades || []);
      } catch {
        setPolygonPropCount(0);
        setPolygonProps([]);
      } finally {
        setPolygonLoading(false);
      }
    },
    [operation, tipoInmueble],
  );

  const handleToggleDrawMode = useCallback(
    (active) => {
      setDrawMode(active);
      if (active) {
        setSearchParams({ draw: "true" }, { replace: true });
        clearZone();
      } else {
        setSearchParams({}, { replace: true });
        setCustomPolygon(null);
        setPolygonProps([]);
        setPolygonPropCount(0);
      }
    },
    [setSearchParams, clearZone],
  );

  const handleVerInmuebles = () => {
    if (customPolygon) {
      const polygonKey = `poly_${Date.now()}`;
      try {
        sessionStorage.setItem(polygonKey, JSON.stringify(customPolygon));
        sessionStorage.setItem(`${polygonKey}_op`, operation);
        sessionStorage.setItem(`${polygonKey}_tipo`, tipoInmueble);
      } catch {}
      navigate(
        `/${operation}-${tipoInmueble}/zona-personalizada?polyKey=${polygonKey}`,
      );
      return;
    }

    const url = buildSearchUrl(
      { ...selectedZone, operation, tipoInmueble },
      deptNames,
    );
    if (url) navigate(url);
  };

  return (
    <div className="flex flex-col w-screen h-dvh relative bg-white font-poppins">
      <header className="flex items-center gap-5 px-4 md:px-6 py-4 border-b border-gray-200 bg-white z-1000 shrink-0 w-full justify-between">
        <div
          className={`items-center gap-6 ${mobileSearchOpen ? "hidden md:flex" : "flex"}`}
        >
          <h1 className="text-base md:text-xl text-gray-800 m-0">
            {drawMode ? "Dibujar tu zona" : "Seleccionar zonas"}
          </h1>
          {!drawMode && (
            <button
              className="flex items-center gap-2 md:hidden"
              onClick={() => setMobileSearchOpen(true)}
            >
              <FiSearch className="text-black/60 shrink-0" />
              <span>Buscar</span>
            </button>
          )}
        </div>

        {!drawMode && (
          <div
            className={`items-center gap-2 ${mobileSearchOpen ? "flex w-full" : "hidden md:flex"}`}
          >
            <InputSearchZona
              onSelectZone={(zone) =>
                handleSelectZone(zone, operation, tipoInmueble)
              }
              operation={operation}
              tipoInmueble={tipoInmueble}
              className={`border-2 ${mobileSearchOpen ? "w-full" : "w-100"}`}
              showX={true}
            />
            <button
              className="md:hidden shrink-0 text-gray-500"
              onClick={() => setMobileSearchOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        <button
          className={`py-2 md:px-4 border-none bg-transparent text-gray-500 cursor-pointer text-sm hover:text-noveno ${
            mobileSearchOpen ? "hidden md:block" : ""
          }`}
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
      </header>

      <div className="flex-1 relative">
        <SelectZonaMap
          selectedZone={selectedZone}
          onSelectZone={handleSelectZone}
          operation={operation}
          tipoInmueble={tipoInmueble}
          drawMode={drawMode}
          onToggleDrawMode={handleToggleDrawMode}
          onPolygonChange={handlePolygonChange}
          polygonProperties={polygonProps}
          polygonPropCount={polygonPropCount}
          polygonLoading={polygonLoading}
          onVerInmuebles={handleVerInmuebles}
        />
      </div>

      {!drawMode && selectedZone && (
        <div className="absolute top-22 md:top-24 left-5 bg-white rounded shadow-lg p-4 min-w-90 z-1000 font-poppins min-h-44 flex flex-col justify-between">
          <div>
            <div className="text-xl font-semibold text-gray-800 m-0 mb-3 flex items-center gap-3">
              <TfiMapAlt />
              <h3>Zona seleccionada</h3>
            </div>
            <div className="flex items-center gap-2 px-2 py-2.5 mb-3">
              <span className="flex-1 text-base text-gray-800">
                {selectedZone.name}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {propertyCount.toLocaleString()}
              </span>
              <button
                className="bg-none border-none cursor-pointer text-lg p-0 leading-none hover:opacity-100 font-poppins font-semibold text-blue-700 hover:text-blue-500"
                onClick={clearZone}
                title="Volver a seleccionar"
              >
                <PiTrashSimple />
              </button>
            </div>
          </div>
          <button
            className="w-full py-3 px-5 bg-noveno text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-colors hover:bg-[#c40068] disabled:opacity-50"
            onClick={handleVerInmuebles}
            disabled={loading}
          >
            Ver {propertyCount.toLocaleString()} inmuebles
          </button>
        </div>
      )}
    </div>
  );
}
