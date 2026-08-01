import { elegirTamano, construirSrcSet } from "../../utils/galeriaUtils";

/**
 * Renderiza una foto ya agrupada (ver agruparPorOrden), sirviendo el tamaño
 * correcto según el contexto y usando srcSet para que el navegador elija
 * automáticamente la mejor versión según pantalla/densidad de píxeles.
 *
 * @param {Object} foto - foto agrupada (de agruparPorOrden)
 * @param {'thumbnail'|'small'|'medium'|'large'|'xlarge'} tamañoBase - tamaño por defecto (fallback de src)
 * @param {string} sizes - atributo `sizes` de HTML (ver ejemplos de uso abajo)
 */
export default function PropertyImage({ foto, tamañoBase = "medium", sizes, alt = "", className, ...props }) {
  if (!foto) return null;

  const src = elegirTamano(foto, tamañoBase);
  const srcSet = construirSrcSet(foto);

  if (!src) return null;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}
