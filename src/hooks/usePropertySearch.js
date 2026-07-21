// src/hooks/usePropertySearch.js
import { useState, useEffect } from "react";
import { apiBackend } from "@/api/apiBackend.js";

export function usePropertySearch(searchParams) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchParams) {
      setProperties([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchPropertiesData() {
      setLoading(true);
      setError(null);

      // Consumimos el nuevo endpoint enviando los slugs indexados
      const endpoint = `/propiedades/search-slugs?operation=${searchParams.operation}&type=${searchParams.propertyType}&city=${searchParams.citySlug}&dept=${searchParams.departmentSlug}`;

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

    fetchPropertiesData();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return { properties, loading, error };
}
