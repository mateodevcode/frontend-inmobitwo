import { useEffect, useRef } from "react";

/**
 * Devuelve un ref que hay que colocar en un elemento "sentinel" invisible.
 * Cuando ese elemento sale del viewport por arriba (scroll hacia abajo),
 * llama a `onCambioVisibilidad(true)`; mientras esté visible o se haya
 * ido por abajo, llama a `onCambioVisibilidad(false)`.
 *
 * Antes esta misma lógica (sentinel + IntersectionObserver) estaba
 * duplicada en GaleriaInmuebles.jsx y DetalleInmuble.jsx, cada una con
 * su propio observer controlando el mismo estado `mostrarBarraSticky`.
 * Ahora solo se usa una vez, en el punto correcto (después del bloque
 * de precio).
 */
export default function useScrollSentinel(onCambioVisibilidad) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onCambioVisibilidad);
  callbackRef.current = onCambioVisibilidad;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current(false);
          return;
        }
        callbackRef.current(entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return sentinelRef;
}
