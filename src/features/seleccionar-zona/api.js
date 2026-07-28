// src/features/seleccionar-zona/api.js
import { apiBackend } from "@/api/apiBackend.js";
import { MAPPING_TIPOS } from "@/data/mappings_busqueda.js";

export async function fetchRegionsGeoJSON() {
  const res = await apiBackend("/api/regions/geojson");
  if (!res.success) throw new Error(res.error || "Error cargando regiones");
  return res.data;
}

export async function fetchStatesGeoJSON() {
  const res = await apiBackend("/api/states/geojson");
  if (!res.success) throw new Error(res.error || "Error cargando departamentos");
  return res.data;
}

export async function fetchCitiesGeoJSON(stateDaneCode) {
  const res = await apiBackend(`/api/cities/geojson?stateDaneCode=${stateDaneCode}`);
  if (!res.success) throw new Error(res.error || "Error cargando municipios");
  return res.data;
}

export async function fetchBarrios(cityDaneCode) {
  const res = await apiBackend(`/api/barrios?cityDaneCode=${cityDaneCode}`);
  if (!res.success) return { type: "FeatureCollection", features: [] };
  return res.data;
}

function expandTipoInmueble(slug) {
  return MAPPING_TIPOS[slug] || slug;
}

export async function fetchGeoCount(type, daneCode, operation, tipoInmuebleSlug) {
  const inmueble = expandTipoInmueble(tipoInmuebleSlug);
  const params = new URLSearchParams({ type, daneCode });
  if (operation) params.set("operation", operation);
  if (inmueble) params.set("inmueble", inmueble);
  const res = await apiBackend(`/api/geo-count?${params.toString()}`);
  if (!res.success) return 0;
  return res.data.total || 0;
}

export async function fetchInmueblesEnPoligono(polygon, operation, tipoInmuebleSlug) {
  const inmueble = expandTipoInmueble(tipoInmuebleSlug);
  const body = {
    polygon,
    operation: operation || undefined,
    tipoInmueble: inmueble || undefined,
  };
  const res = await apiBackend("/api/inmuebles-en-poligono", "POST", body);
  if (!res.success) return { total: 0, propiedades: [] };
  return res.data;
}
