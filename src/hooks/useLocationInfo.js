import { useState, useEffect } from "react";
import { apiBackend } from "@/api/apiBackend";
import { MAPPING_OPERACIONES, MAPPING_TIPOS } from "@/data/mappings_busqueda";

export function useLocationInfo({
  operationSlug,
  typeSlug,
  citySlug,
  deptSlug,
  firstSegment,
  isSingleSegment,
}) {
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const operationDb = MAPPING_OPERACIONES[operationSlug] || operationSlug;
  const typeDb = MAPPING_TIPOS[typeSlug] || typeSlug;

  useEffect(() => {
    if (!deptSlug) return;

    let cancelled = false;

    async function fetchLocationInfo() {
      setLoading(true);
      setError(null);

      if (isSingleSegment) {
        const res = await apiBackend(
          `/api/location-info?dept=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
        );
        if (cancelled) return;
        if (res.success) {
          setLocationInfo(res.data);
        } else {
          const res2 = await apiBackend(
            `/api/location-info?region=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
          );
          if (cancelled) return;
          if (res2.success) setLocationInfo(res2.data);
          else setError(res2.message || "Ubicación no encontrada");
        }
      } else {
        const res = await apiBackend(
          `/api/location-info?city=${citySlug}&dept=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
        );
        if (cancelled) return;
        if (res.success) setLocationInfo(res.data);
        else setError(res.message || "Ubicación no encontrada");
      }

      setLoading(false);
    }

    fetchLocationInfo();

    return () => {
      cancelled = true;
    };
  }, [firstSegment, citySlug, deptSlug, operationDb, typeDb, isSingleSegment]);

  return { locationInfo, loading, error };
}
