import { useMemo, useState } from "react";
import FiltroRelevante from "./FiltroRelevante";
import { useSlugParser } from "@/hooks/useSlugParser";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { useNavigate } from "react-router-dom";
import CardAnuncioCompra from "./card-anuncio/CardAnuncioCompra";
import CardAnuncio from "./card-anuncio/CardAnuncio";

const TYPE_LABELS = {
  apartamento: "Apartamentos",
  casa: "Casas",
  casa_campestre: "Casas campestres",
  apartaestudio: "Apartaestudios",
  penthouse: "Penthouses",
  casa_lote: "Casas lote",
  local: "Locales",
  oficina: "Oficinas",
  bodega: "Bodegas",
  consultorio: "Consultorios",
  edificio: "Edificios",
  lote: "Lotes",
  finca: "Fincas",
  parqueadero: "Parqueaderos",
  trastero: "Trasteros",
  habitacion: "Habitaciones",
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
  const [orden, setOrden] = useState("relevante");
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

  const properties = useMemo(
    () =>
      isCustomPolygon ? polygonProps?.propiedades || [] : searchProperties,
    [isCustomPolygon, polygonProps, searchProperties],
  );
  const loading = isCustomPolygon
    ? !polygonProps && !polygonMissing
    : searchLoading;
  const error = isCustomPolygon ? null : searchError;

  // Ordenamiento por opción seleccionada
  const propiedadesOrdenadas = useMemo(() => {
    const lista = [...properties];
    const area = (p) => p.private_area ?? p.constructed_area ?? 0;
    const precioPm2 = (p) =>
      p.price_per_sqm ??
      (p.precio && area(p) ? p.precio / area(p) : null);

    switch (orden) {
      case "baratos":
        lista.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
        break;
      case "precio_mas_alto":
        lista.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
        break;
      case "recientes":
        lista.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "antiguos":
        lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "han_bajado_mas":
        // Requiere historial de precios (price_history) aún no disponible
        break;
      case "baratos_pm2":
        lista.sort(
          (a, b) => (precioPm2(a) ?? Infinity) - (precioPm2(b) ?? Infinity),
        );
        break;
      case "caros_pm2":
        lista.sort(
          (a, b) => (precioPm2(b) ?? 0) - (precioPm2(a) ?? 0),
        );
        break;
      case "grandes":
        lista.sort((a, b) => area(b) - area(a));
        break;
      case "pequenos":
        lista.sort((a, b) => area(a) - area(b));
        break;
      default:
        break; // relevante: mantiene el orden del backend
    }
    return lista;
  }, [properties, orden]);

  const listaIds = properties.map((p) => p.id);
  const total = properties.length;
  const filtroLabel = getFiltroLabel(locationInfo, typeSlug, isCustomPolygon);

  return (
    <div className="w-full md:w-[75%] h-full">
      <FiltroRelevante value={orden} onChange={setOrden} />
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
        {propiedadesOrdenadas.map((propiedad, index) =>
          propiedad.operacion_slug === "venta" ? (
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
