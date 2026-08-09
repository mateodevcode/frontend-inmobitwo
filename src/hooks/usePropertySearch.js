import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiBackend } from "@/api/apiBackend";
import { MAPPING_OPERACIONES, MAPPING_TIPOS } from "@/data/mappings_busqueda";

export function usePropertySearch({ operationSlug, typeSlug, citySlug, deptSlug }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const operationDb = MAPPING_OPERACIONES[operationSlug] || operationSlug;
  const typeDb = MAPPING_TIPOS[typeSlug] || typeSlug;
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const tamMin = searchParams.get("tamMin");
  const tamMax = searchParams.get("tamMax");
  const tipos = searchParams.get("tipos");
  const rental = searchParams.get("rental");
  const fecha = searchParams.get("fecha");
  const anunciante = searchParams.get("anunciante");
  const multimedia = searchParams.get("multimedia");
  const hab = searchParams.get("hab");
  const banos = searchParams.get("banos");
  const estado = searchParams.get("estado");
  const caract = searchParams.get("caract");

  useEffect(() => {
    if (!operationDb || !typeDb || !deptSlug) return;

    let cancelled = false;

    async function fetchProperties() {
      setLoading(true);
      setError(null);

      const filtrosExtra =
        `${min ? `&min=${min}` : ""}${max ? `&max=${max}` : ""}` +
        `${tamMin ? `&tamMin=${tamMin}` : ""}${tamMax ? `&tamMax=${tamMax}` : ""}` +
        `${rental ? `&rental=${rental}` : ""}${fecha ? `&fecha=${fecha}` : ""}` +
        `${anunciante ? `&anunciante=${anunciante}` : ""}` +
        `${multimedia ? `&multimedia=${multimedia}` : ""}` +
        `${hab ? `&hab=${hab}` : ""}` +
        `${banos ? `&banos=${banos}` : ""}` +
        `${estado ? `&estado=${estado}` : ""}` +
        `${caract ? `&caract=${caract}` : ""}`;

      // Si hay filtro por múltiples tipos (Tipo de vivienda) → endpoint dedicado
      const endpoint = tipos
        ? `/propiedades/search-vivienda?operation=${operationDb}&tipos=${tipos}` +
          `&city=${citySlug || ""}&dept=${deptSlug}${filtrosExtra}`
        : `/propiedades/search-slugs?operation=${operationDb}&type=${typeDb}` +
          `&city=${citySlug || ""}&dept=${deptSlug}${filtrosExtra}`;

      const res = await apiBackend(endpoint, "GET");

      if (cancelled) return;

      if (res.success) {
        setProperties(res.data ?? []);
      } else {
        setError(res.message || "Error al cargar inmuebles");
        setProperties([]);
      }

      setLoading(false);
    }

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [operationDb, typeDb, citySlug, deptSlug, min, max, tamMin, tamMax, tipos, rental, fecha, anunciante, multimedia, hab, banos, estado, caract]);

  return { properties, loading, error };
}
