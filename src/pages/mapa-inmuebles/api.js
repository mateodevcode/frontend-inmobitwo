// src/pages/mapa-inmuebles/api.js
import { apiBackend } from "@/api/apiBackend.js";
import { MAPPING_TIPOS } from "@/data/mappings_busqueda.js";

function expandTipoInmueble(slug) {
  return MAPPING_TIPOS[slug] || slug;
}

export async function fetchInmueblesEnBbox({ minLat, minLng, maxLat, maxLng, operation, tipoInmueble }) {
  const params = new URLSearchParams({ minLat, minLng, maxLat, maxLng });
  if (operation) params.set("operation", operation.toLowerCase());
  if (tipoInmueble) params.set("tipoInmueble", expandTipoInmueble(tipoInmueble));

  const res = await apiBackend(`/propiedades/inmuebles-en-bbox?${params.toString()}`);
  if (!res.success) throw new Error(res.error || "Error cargando inmuebles");
  return res.data || [];
}

export async function fetchPropiedadResumen(id) {
  const res = await apiBackend(`/propiedades/${id}/resumen`);
  if (!res.success) return null;
  return res.data;
}
