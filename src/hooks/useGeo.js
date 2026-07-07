// src/hooks/useGeo.js
//
// Hook genérico para cargar una lista desde el backend (countries/states/cities)
// usando el wrapper apiBackend. Se reutiliza para los 3 niveles en cascada.
//
// `endpoint` debe incluir el querystring ya armado, ej:
//   "/api/states?countryId=1"
// Si `endpoint` es null/undefined, el hook no dispara la petición
// (útil para el caso "todavía no hay país elegido, no cargues provincias").

import { useState, useEffect } from "react";
import { apiBackend } from "@/api/apiBackend.js";

export function useGeo(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      setData([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      const res = await apiBackend(endpoint, "GET");

      if (cancelled) return;

      if (res.success) {
        setData(res.data ?? []);
      } else {
        setError(res.message || "Error al cargar datos");
        setData([]);
      }

      setLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return { data, loading, error };
}
