// hooks/usePreloadData.js
//
// Precarga datos ESTÁTICOS en background sin bloquear la UI.
// Se usa una sola vez al montar (ej: en App) y rellena la caché estática
// (memoria + sessionStorage) para que useGeo/useAsyncState no vuelvan a pedir
// esos endpoints.
//
// Endpoints precargados (reales del backend):
//   - /catalogos/*            → catálogos de la app (tipos de inmueble, estados, características)
//   - /api/countries          → países (auto-selección de Colombia en el wizard)
//   - /api/states?countryId=  → departamentos del país por defecto (Colombia)
// Los barrios NO se precargan por red: ya son locales (src/data/barrios.js).

import { useEffect } from "react";
import { fetchStaticJson } from "@/hooks/staticCache";

export const STATIC_ENDPOINTS = [
  "/catalogos/tipos-inmueble",
  "/catalogos/estados",
  "/catalogos/caracteristicas",
];

const COUNTRY_DEFAULT = "Colombia";

export const preloadStaticData = async () => {
  try {
    // 1) Catálogos en paralelo
    await Promise.all(STATIC_ENDPOINTS.map((e) => fetchStaticJson(e)));

    // 2) Geo en cascada: países → departamentos del país por defecto
    const countries = await fetchStaticJson("/api/countries");
    if (Array.isArray(countries)) {
      const porNombre = countries.find(
        (c) => c.name?.toLowerCase() === COUNTRY_DEFAULT.toLowerCase(),
      );
      const porIso = countries.find((c) => c.iso2 === "CO");
      const colombia = porNombre ?? porIso;
      if (colombia?.id) {
        await fetchStaticJson(`/api/states?countryId=${colombia.id}`);
      }
    }
  } catch (error) {
    // La precarga es opcional; la app sigue funcionando sin ella
    console.error("Preload failed:", error);
  }
};

export const usePreloadData = () => {
  useEffect(() => {
    preloadStaticData();
  }, []);
};

export default usePreloadData;
