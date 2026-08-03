import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Si se navegó a esta pantalla con `location.state.abrirFotoVisor`
 * (p. ej. "mapa" | "planos" | true), limpia ese flag del state y
 * redirige al visor de fotos correspondiente.
 *
 * Antes esta lógica estaba duplicada en DetallePropiedad.jsx y
 * GaleriaInmuebles.jsx. En GaleriaInmuebles además estaba rota:
 * usaba el `location` global del navegador en vez de useLocation(),
 * por lo que `location.state` siempre era undefined ahí.
 */
export default function useAbrirFotoVisorDesdeState(inmuebleId) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const modo = location.state?.abrirFotoVisor;
    if (!modo || !inmuebleId) return;

    const { abrirFotoVisor, ...restState } = location.state;
    navigate(location.pathname, { replace: true, state: restState });

    const query =
      modo === "mapa" ? "?mapa=1" : modo === "planos" ? "?planos=1" : "";
    navigate(`/inmueble/${inmuebleId}/foto/1${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inmuebleId]);
}
