import { useMemo, useState } from "react";
import { agruparPorOrden } from "@/utils/galeriaUtils";
import useAbrirFotoVisorDesdeState from "./useAbrirFotoVisorDesdeState";

/**
 * Toda la lógica de DetallePropiedad: efecto de abrirFotoVisor, estado
 * de la barra sticky, y los cálculos derivados de `inmueble` (fotos
 * agrupadas, total de planos, línea de specs). El componente que lo
 * use solo arma el JSX con lo que este hook devuelve.
 */
export default function useDetallePropiedad(inmueble) {
  useAbrirFotoVisorDesdeState(inmueble?.id);

  // ──────────────────────── Barra sticky al hacer scroll ────────────────────────
  const [mostrarBarraSticky, setMostrarBarraSticky] = useState(false);

  // ──────────────────────── Carrusel ────────────────────────
  // Una "foto" = filas con el mismo orden (5 tamaños). La portada (orden -1)
  // ya viene dentro de galeria y queda primera. Agrupar evita duplicar 5x.
  const fotos = useMemo(
    () =>
      [
        ...agruparPorOrden(inmueble?.galeria),
        ...agruparPorOrden(inmueble?.planos),
      ].filter((f) => f.tamaños && Object.keys(f.tamaños).length > 0),
    [inmueble?.galeria, inmueble?.planos],
  );

  const totalImagenes = fotos.length;

  const totalPlanos = useMemo(
    () => agruparPorOrden(inmueble?.planos).length,
    [inmueble?.planos],
  );

  const specsLinea = useMemo(() => {
    if (!inmueble) return [];
    return [
      inmueble.constructed_area
        ? `${inmueble.constructed_area} m²`
        : inmueble.private_area
          ? `${inmueble.private_area} m²`
          : null,
      inmueble.bedroom_count != null
        ? `${inmueble.bedroom_count} alc.`
        : inmueble.room_count != null
          ? `${inmueble.room_count} amb.`
          : null,
      inmueble.floor
        ? `${inmueble.floor} ${inmueble.has_elevator ? "con ascensor" : ""}`
        : null,
      inmueble.estrato != null ? `Estrato ${inmueble.estrato}` : null,
    ].filter(Boolean);
  }, [inmueble]);

  return {
    mostrarBarraSticky,
    setMostrarBarraSticky,
    fotos,
    totalImagenes,
    totalPlanos,
    specsLinea,
  };
}
