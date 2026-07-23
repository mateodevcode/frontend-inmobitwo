import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiMapAlt } from "react-icons/tfi";
import { useSlugParser } from "@/hooks/useSlugParser";
import { getSelectedId, getTabs } from "@/data/tabs_busqueda";

const TYPE_LABELS = {
  viviendas: { singular: "casa y piso", plural: "casas y pisos" },
  habitaciones: { singular: "habitación", plural: "habitaciones" },
  oficinas: { singular: "oficina", plural: "oficinas" },
  locales: { singular: "local", plural: "locales" },
  garajes: { singular: "garaje", plural: "garajes" },
  terrenos: { singular: "terreno", plural: "terrenos" },
  edificios: { singular: "edificio", plural: "edificios" },
  "casa-o-chalet": { singular: "casa o chalet", plural: "casas o chalets" },
  "casa-rustica": { singular: "casa rústica", plural: "casas rústicas" },
  "obra-nueva": { singular: "promoción de obra nueva", plural: "promociones de obra nueva" },
  vacacional: { singular: "alojamiento vacacional", plural: "alojamientos vacacionales" },
};

function getTypeLabel(typeSlug, count = 0) {
  const labels = TYPE_LABELS[typeSlug];
  if (!labels) return typeSlug;
  return count === 1 ? labels.singular : labels.plural;
}

const EncabezadoBusqueda = ({ locationInfo }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const { operationSlug, typeSlug, citySlug, geoSegment } = useSlugParser();
  const selectedId = getSelectedId(operationSlug, typeSlug);
  const tabs = getTabs(operationSlug);

  const handleTabClick = (tab) => {
    if (tab.id === selectedId) return;
    const newPath = geoSegment
      ? `/${tab.urlSegment}/${geoSegment}`
      : `/${tab.urlSegment}`;
    navigate(newPath);
  };

  return (
    <div className="w-[75%] h-full flex flex-col justify-between">
      <div className="mx-4">
        <p className="font-semibold text-lg sm:text-xl md:text-2xl text-segundo leading-snug">
          <span>{locationInfo?.total_matching?.toLocaleString() || 0}</span>{" "}
          <span>
            {getTypeLabel(typeSlug, locationInfo?.total_matching || 0)}
          </span>{" "}
          {locationInfo?.tipo === "region" ? (
            <span>en {locationInfo?.region_name}</span>
          ) : locationInfo?.tipo === "departamento" ? (
            <span className="mr-2">
              en {locationInfo?.state_name}
              {locationInfo?.region_name ? `, ${locationInfo?.region_name}` : ""}
            </span>
          ) : (
            <span className="mr-2">
              en {locationInfo?.city_name || citySlug},{" "}
              {locationInfo?.state_name || geoSegment?.split("-").pop()}
            </span>
          )}{" "}
          <span
            className="inline-flex items-center gap-1 align-middle text-blue-500 font-semibold text-sm sm:text-base cursor-pointer select-none hover:text-blue-600"
            onClick={() => navigate("/busqueda-multizona/venta-viviendas")}
          >
            <TfiMapAlt className="shrink-0 text-xl" />
            Modificar zona
          </span>
        </p>
      </div>

      <div className="h-9 relative flex gap-2 mx-4">
        {tabs.map((tab) => {
          const isActive = tab.id === selectedId || tab.id === hovered;

          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => setHovered(tab.id)}
              onMouseLeave={() => setHovered(null)}
              className="px-4 cursor-pointer relative"
            >
              <p
                className={`font-semibold select-none hover:text-tercero text-cuarto ${
                  isActive ? "text-tercero" : "text-cuarto"
                }`}
              >
                {tab.nombre}
              </p>

              <span
                className="absolute left-0 bottom-0 h-0.5 w-full bg-tercero origin-left transition-transform duration-300 ease-out z-10"
                style={{
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>
          );
        })}

        <div className="h-0.5 w-full bg-gray-300 absolute bottom-0" />
      </div>
    </div>
  );
};

export default EncabezadoBusqueda;
