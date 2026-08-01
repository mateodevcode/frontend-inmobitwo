// src/utils/galeriaUtils.js

const ORDEN_TAMANOS_FALLBACK = ["large", "medium", "small", "xlarge", "thumbnail"];

/**
 * Agrupa las filas planas que devuelve el backend (una por tamaño) en fotos
 * completas. Una "foto" = todas las filas que comparten el mismo `orden`.
 *
 * @param {Array} filas - array de filas tal como vienen de la API (galeria o planos)
 * @returns {Array} [{ orden, esPortada, tamaños: { thumbnail, small, medium, large, xlarge } }]
 *          ordenado por `orden` ascendente (la portada, orden -1, queda primera)
 */
export function agruparPorOrden(filas) {
  if (!Array.isArray(filas)) return [];

  const mapa = new Map();

  for (const fila of filas) {
    const orden = fila.orden;
    if (!mapa.has(orden)) {
      mapa.set(orden, {
        orden,
        esPortada: !!fila.es_portada,
        tamaños: {},
      });
    }
    const foto = mapa.get(orden);
    foto.tamaños[fila.tamaño] = fila.url;
    // por si alguna fila trae es_portada y otras no (no debería pasar, pero por robustez)
    if (fila.es_portada) foto.esPortada = true;
  }

  return Array.from(mapa.values()).sort((a, b) => a.orden - b.orden);
}

/**
 * Elige la URL del tamaño pedido para una foto ya agrupada, con fallback en
 * cascada si ese tamaño específico no existe (p.ej. fotos viejas migradas que
 * solo tienen 'medium').
 *
 * @param {Object} fotoAgrupada - una foto tal como la devuelve agruparPorOrden()
 * @param {'thumbnail'|'small'|'medium'|'large'|'xlarge'} tamañoDeseado
 * @returns {string|null}
 */
export function elegirTamano(fotoAgrupada, tamañoDeseado) {
  if (!fotoAgrupada?.tamaños) return null;

  if (fotoAgrupada.tamaños[tamañoDeseado]) {
    return fotoAgrupada.tamaños[tamañoDeseado];
  }

  // Fallback: busca el tamaño más cercano disponible, priorizando por calidad/tamaño
  const ordenFallback = [
    tamañoDeseado,
    ...ORDEN_TAMANOS_FALLBACK.filter((t) => t !== tamañoDeseado),
  ];
  for (const t of ordenFallback) {
    if (fotoAgrupada.tamaños[t]) return fotoAgrupada.tamaños[t];
  }
  return null;
}

/**
 * Extrae la portada de un array de filas de galería ya agrupado (o sin agrupar,
 * agrupa internamente). Devuelve null si la propiedad no tiene portada.
 */
export function obtenerPortada(filasGaleria, tamaño = "medium") {
  const fotos = agruparPorOrden(filasGaleria);
  const portada = fotos.find((f) => f.esPortada);
  return portada ? elegirTamano(portada, tamaño) : null;
}

/**
 * Fotos de galería SIN la portada (para grillas/carousels que no deben repetirla).
 */
export function galeriaSinPortada(filasGaleria) {
  return agruparPorOrden(filasGaleria).filter((f) => !f.esPortada);
}

/**
 * Arma el string de `srcSet` con los tamaños disponibles, para usar en <img srcset="">.
 * Los anchos son aproximados (coinciden con los límites reales del backend Rust).
 */
const ANCHOS_PX = {
  thumbnail: 200,
  small: 480,
  medium: 900,
  large: 1400,
  xlarge: 2000,
};

export function construirSrcSet(fotoAgrupada) {
  if (!fotoAgrupada?.tamaños) return "";
  return Object.entries(fotoAgrupada.tamaños)
    .filter(([, url]) => !!url)
    .map(([tamano, url]) => `${url} ${ANCHOS_PX[tamano]}w`)
    .join(", ");
}
