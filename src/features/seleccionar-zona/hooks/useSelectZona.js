// src/features/seleccionar-zona/hooks/useSelectZona.js
import { useState, useCallback, useRef } from "react";
import { fetchGeoCount } from "../api";

export function useSelectZona() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const countCacheRef = useRef({});

  const selectZone = useCallback(async (zone, operation, tipoInmueble) => {
    if (!zone) {
      setSelectedZone(null);
      setPropertyCount(0);
      return;
    }

    setSelectedZone(zone);
    setLoading(true);

    try {
      const cacheKey = `${zone.type}:${zone.daneCode}:${operation}:${tipoInmueble}`;

      if (countCacheRef.current[cacheKey] !== undefined) {
        setPropertyCount(countCacheRef.current[cacheKey]);
      } else {
        const count = await fetchGeoCount(
          zone.type,
          zone.daneCode,
          operation,
          tipoInmueble,
        );
        countCacheRef.current[cacheKey] = count;
        setPropertyCount(count);
      }
    } catch {
      setPropertyCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearZone = useCallback(() => {
    setSelectedZone(null);
    setPropertyCount(0);
  }, []);

  return { selectedZone, setSelectedZone: selectZone, clearZone, propertyCount, loading };
}
