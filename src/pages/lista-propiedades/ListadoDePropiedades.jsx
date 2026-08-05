import FiltroRelevante from "./FiltroRelevante";
import { useSlugParser } from "@/hooks/useSlugParser";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { useNavigate } from "react-router-dom";
import CardAnuncioCompra from "./card-anuncio/CardAnuncioCompra";
import CardAnuncio from "./card-anuncio/CardAnuncio";

const TYPE_LABELS = {
  viviendas: "Viviendas",
  habitaciones: "Habitaciones",
  oficinas: "Oficinas",
  locales: "Locales",
  garajes: "Garajes",
  terrenos: "Terrenos",
  edificios: "Edificios",
  "casa-o-chalet": "Casas o chalets",
  "casa-rustica": "Casas rústicas",
  "obra-nueva": "Obra nueva",
  vacacional: "Vacacional",
};

function getFiltroLabel(locationInfo, typeSlug, isCustomPolygon) {
  if (isCustomPolygon) return "Zona personalizada";
  const typeLabel = TYPE_LABELS[typeSlug] || typeSlug || "Inmuebles";
  const locName =
    locationInfo?.city_name ||
    locationInfo?.state_name ||
    locationInfo?.region_name ||
    "resultados";
  return `${typeLabel} de ${locName}`;
}

const ListadoDePropiedades = ({
  locationInfo,
  operationSlug,
  typeSlug,
  polygonProps,
  polygonMissing,
  isCustomPolygon,
}) => {
  const { citySlug, deptSlug } = useSlugParser();
  const navigate = useNavigate();
  const {
    properties: searchProperties,
    loading: searchLoading,
    error: searchError,
  } = usePropertySearch({
    operationSlug,
    typeSlug,
    citySlug: isCustomPolygon ? "" : citySlug,
    deptSlug: isCustomPolygon ? "" : deptSlug,
  });

  const properties = isCustomPolygon
    ? polygonProps?.propiedades || []
    : searchProperties;
  const loading = isCustomPolygon
    ? !polygonProps && !polygonMissing
    : searchLoading;
  const error = isCustomPolygon ? null : searchError;

  const listaIds = properties.map((p) => p.id);
  const total = properties.length;
  const filtroLabel = getFiltroLabel(locationInfo, typeSlug, isCustomPolygon);

  return (
    <div className="w-full md:w-[75%] h-full">
      <FiltroRelevante />
      <div className="flex flex-col gap-4 p-4">
        {loading && (
          <div className="text-center py-20 text-gray-400 min-h-96 flex items-center justify-center">
            Cargando propiedades...
          </div>
        )}
        {error && <div className="text-center py-20 text-red-400">{error}</div>}
        {isCustomPolygon && polygonMissing && !loading && (
          <div className="text-center py-20 min-h-96 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500">
              Tu zona personalizada ya no está disponible. Vuelve a seleccionar
              la zona en el mapa.
            </p>
            <button
              onClick={() =>
                navigate(`/busqueda-multizona/${operationSlug}-${typeSlug}`)
              }
              className="px-5 py-2.5 bg-[#e6007a] text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-colors hover:bg-[#c40068]"
            >
              Volver a seleccionar zona
            </button>
          </div>
        )}
        {!loading && !error && !polygonMissing && properties.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No se encontraron inmuebles en esta zona.
          </div>
        )}
        {properties.map((propiedad, index) =>
          propiedad.operacion === "venta" ? (
            <CardAnuncioCompra
              propiedad={propiedad}
              key={propiedad.id}
              listaIds={listaIds}
              posicion={index}
              total={total}
              filtroLabel={filtroLabel}
            />
          ) : (
            <CardAnuncio
              propiedad={propiedad}
              key={propiedad.id}
              listaIds={listaIds}
              posicion={index}
              total={total}
              filtroLabel={filtroLabel}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default ListadoDePropiedades;
