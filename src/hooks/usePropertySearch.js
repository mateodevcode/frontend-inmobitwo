import { useState, useEffect } from "react";
import { apiBackend } from "@/api/apiBackend";
import { MAPPING_OPERACIONES, MAPPING_TIPOS } from "@/data/mappings_busqueda";

export function usePropertySearch({ operationSlug, typeSlug, citySlug, deptSlug }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const operationDb = MAPPING_OPERACIONES[operationSlug] || operationSlug;
  const typeDb = MAPPING_TIPOS[typeSlug] || typeSlug;

  useEffect(() => {
    if (!operationDb || !typeDb || !deptSlug) return;

    let cancelled = false;

    async function fetchProperties() {
      setLoading(true);
      setError(null);

      const endpoint = `/propiedades/search-slugs?operation=${operationDb}&type=${typeDb}&city=${citySlug || ""}&dept=${deptSlug}`;

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
  }, [operationDb, typeDb, citySlug, deptSlug]);

  return { properties, loading, error };
}
