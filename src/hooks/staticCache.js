// hooks/staticCache.js
//
// Caché compartida para datos ESTÁTICOS (catálogos y geo).
// Estrategia de doble nivel:
//   1) Memoria a nivel de módulo (promise única) → deduplica requests simultáneos
//   2) sessionStorage persistente → evita re-fetch entre vistas
// Lo usan usePreloadData (para precargar) y useGeo (para leer/llenar).
//
// La clave es el endpoint completo, ej: "/api/countries".

import { apiBackend } from "@/api/apiBackend";

const STORAGE_PREFIX = "staticCache:";
const MEMORY_TTL = 5 * 60 * 1000;

const inFlight = new Map();
const memory = new Map();

export const readStaticCache = (key) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > MEMORY_TTL) {
      sessionStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

export const writeStaticCache = (key, data) => {
  try {
    sessionStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {
    // storage lleno: la memoria a nivel de módulo sigue funcionando
  }
};

// Fetch con caché: devuelve `res.data` (o null). Si 2+ callers piden el mismo
// endpoint a la vez, solo se hace 1 request.
export const fetchStaticJson = async (endpoint) => {
  if (memory.has(endpoint) && Date.now() - memory.get(endpoint).ts < MEMORY_TTL) {
    return memory.get(endpoint).data;
  }

  const cached = readStaticCache(endpoint);
  if (cached !== null) {
    memory.set(endpoint, { ts: Date.now(), data: cached });
    return cached;
  }

  if (inFlight.has(endpoint)) return inFlight.get(endpoint);

  const promise = apiBackend(endpoint, "GET")
    .then((res) => {
      const data = res.success ? res.data ?? [] : null;
      if (data !== null) {
        memory.set(endpoint, { ts: Date.now(), data });
        writeStaticCache(endpoint, data);
      }
      return data;
    })
    .finally(() => {
      inFlight.delete(endpoint);
    });

  inFlight.set(endpoint, promise);
  return promise;
};
