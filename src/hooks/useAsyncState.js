// hooks/useAsyncState.js
//
// Hook de estado asíncrono con caché automática (memoria + sessionStorage).
// Reemplaza el patrón de "estado en contexto global + fetch en useEffect".
//
// Uso:
//   const { data, loading, error, refetch } = useAsyncState(
//     async () => (await apiBackend("/propiedades/search-slugs?..." )).data,
//     [operationSlug, typeSlug, min, max],
//     { ttl: 5 * 60 * 1000 }
//   );
//
// - `dependencies`: si cambian, se refetchea y la clave de caché cambia.
// - `cache: false` desactiva sessionStorage (solo memoria).
// - `refetch(true)` fuerza a ignorar caché.

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "useAsyncState:";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

export const useAsyncState = (
  asyncFn,
  dependencies = [],
  { cache = true, ttl = DEFAULT_TTL } = {}
) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const cacheRef = useRef(new Map());
  const mountedRef = useRef(true);
  const asyncFnRef = useRef(asyncFn);

  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);

  const cacheKey = dependencies.join("|");
  const cacheable = cache && dependencies.length > 0;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const aplicar = useCallback((nuevoState) => {
    if (mountedRef.current) setState(nuevoState);
  }, []);

  const execute = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh) {
        // 1) Caché en memoria (por instancia)
        if (cacheRef.current.has(cacheKey)) {
          aplicar(cacheRef.current.get(cacheKey));
          return;
        }
        // 2) Caché en sessionStorage (persistente entre vistas)
        if (cacheable) {
          const sessionKey = `${STORAGE_PREFIX}${cacheKey}`;
          try {
            const raw = sessionStorage.getItem(sessionKey);
            if (raw) {
              const { timestamp, data } = JSON.parse(raw);
              if (Date.now() - timestamp < ttl) {
                const nuevoState = { data, loading: false, error: null };
                cacheRef.current.set(cacheKey, nuevoState);
                aplicar(nuevoState);
                return;
              }
              sessionStorage.removeItem(sessionKey);
            }
          } catch {
            // Entrada corrupta o storage lleno: se ignora y se refetchea
          }
        }
      }

      aplicar({ data: null, loading: true, error: null });
      try {
        const data = await asyncFnRef.current();
        const nuevoState = { data, loading: false, error: null };
        cacheRef.current.set(cacheKey, nuevoState);
        if (cacheable) {
          try {
            sessionStorage.setItem(
              `${STORAGE_PREFIX}${cacheKey}`,
              JSON.stringify({ timestamp: Date.now(), data: nuevoState }),
            );
          } catch {
            // storage lleno: la caché de memoria sigue funcionando
          }
        }
        aplicar(nuevoState);
      } catch (error) {
        aplicar({ data: null, loading: false, error: error.message });
      }
    },
    [aplicar, cacheable, cacheKey, ttl],
  );

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
};

export default useAsyncState;
