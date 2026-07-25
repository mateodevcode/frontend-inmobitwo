// src/features/seleccionar-zona/index.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SelectZonaMap from "./components/SelectZonaMap";
import { useSelectZona } from "./hooks/useSelectZona";
import { buildSearchUrl } from "./utils/urlBuilder";
import { fetchStatesGeoJSON } from "./api";
import { IoTrashOutline } from "react-icons/io5";

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

  const { operation, tipoInmueble } = parseOperationAndType(operationAndType);

  const {
    selectedZone,
    setSelectedZone: selectZone,
    clearZone,
    propertyCount,
    loading,
  } = useSelectZona();
  const [deptNames, setDeptNames] = useState({});

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

    if (
      zone?.type === "municipio" &&
      zone.dptoDaneCode &&
      deptNames[zone.dptoDaneCode]
    ) {
      zone.dptoName = deptNames[zone.dptoDaneCode];
    }
    if (zone?.type === "barrio" && zone.mpioDaneCode) {
      zone.dptoName = deptNames[zone.operation] || "";
    }
  };

  const handleVerInmuebles = () => {
    const url = buildSearchUrl({
      ...selectedZone,
      operation,
      tipoInmueble,
    });
    if (url) navigate(url);
  };

  return (
    <div className="flex flex-col w-screen h-screen relative bg-white font-poppins">
      <header className="flex items-center gap-5 px-6 py-4 border-b border-gray-200 bg-white z-1000 shrink-0 w-full justify-between">
        <h1 className="text-xl font-semibold text-gray-800 m-0">
          Seleccionar zonas
        </h1>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Barrio, ciudad, municipio"
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm bg-gray-100 focus:outline-none focus:border-[#e6007a] focus:bg-white"
          />
        </div>
        <button
          className="py-2 px-4 border-none bg-transparent text-gray-500 cursor-pointer text-sm hover:text-[#e6007a]"
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
        />
      </div>

      {selectedZone && (
        <div className="absolute top-24 left-5 bg-white rounded-lg shadow-lg p-4 min-w-90 z-1000 font-poppins">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 m-0 mb-3">
              Zona seleccionada
            </h3>
            <div className="flex items-center gap-2 px-2 py-2.5 bg-gray-100 rounded-md mb-3">
              <span className="flex-1 text-sm text-gray-800">
                {selectedZone.name}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {propertyCount.toLocaleString()}
              </span>
              <button
                className="bg-none border-none cursor-pointer text-base opacity-60 p-0 leading-none hover:opacity-100"
                onClick={clearZone}
                title="Volver a seleccionar"
              >
                <IoTrashOutline />
              </button>
            </div>
          </div>
          <button
            className="w-full py-3 px-5 bg-[#e6007a] text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-colors hover:bg-[#c40068] disabled:opacity-50"
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
