// src/hooks/useGeo.js
//
// Hook genérico para cargar una lista desde el backend (countries/states/cities)
// usando el wrapper apiBackend. Se reutiliza para los 3 niveles en cascada.
//
// `endpoint` debe incluir el querystring ya armado, ej:
//   "/api/states?countryId=1"
// Si `endpoint` es null/undefined, el hook no dispara la petición
// (útil para el caso "todavía no hay país elegido, no cargues provincias").
//
// Los endpoints de geo son datos ESTÁTICOS → pasan por la caché compartida
// (staticCache): aunque el hook se instancie N veces en el mismo render
// (wizard paso 1), solo se hace 1 request por endpoint y el resto lee caché.

import { useState, useEffect } from "react";
import { fetchStaticJson } from "@/hooks/staticCache";

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

      const result = await fetchStaticJson(endpoint);

      if (cancelled) return;

      if (result !== null) {
        setData(result);
      } else {
        setError("Error al cargar datos");
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

export default useGeo;
