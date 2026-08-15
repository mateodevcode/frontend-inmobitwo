import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetallePropiedad from "./anuncio-id/DetallePropiedad";
import { useEffect, useRef, useCallback } from "react";
import usePropiedades from "../../hooks/usePropiedades";
import { useAppContext } from "@/context/AppContext.js";
import useTracking from "@/hooks/useTracking";
import NavbarHome from "../inicio/navbar/NavbarHome";
import SmartLoader from "@/components/loader/SmartLoader";
import BarraNavegacionTauri from "../../components/barra-navegacion/BarraNavegacionTauri";

const PageAnuncio = () => {
  const { id } = useParams();
  const location = useLocation();
  const { cargarPropiedad } = usePropiedades();
  const { propiedad } = useAppContext();
  const navigate = useNavigate();
  const { dispararEventoYRevisar } = useTracking();

  const idVistaRegistradaRef = useRef(null);

  const navState = location.state || {};
  const { listaIds, posicion, total, filtroLabel, searchUrl } = navState;

  const onNavigateTo = useCallback(
    (direccion) => {
      if (!listaIds || listaIds.length === 0) return;
      const nuevoIndex = posicion + (direccion === "siguiente" ? 1 : -1);
      if (nuevoIndex < 0 || nuevoIndex >= listaIds.length) return;
      navigate(`/inmueble/${listaIds[nuevoIndex]}`, {
        state: {
          listaIds,
          posicion: nuevoIndex,
          total,
          filtroLabel,
        },
        replace: true,
      });
    },
    [listaIds, posicion, total, filtroLabel, navigate],
  );

  useEffect(() => {
    const entrada = Date.now();

    return () => {
      const segundos = Math.round((Date.now() - entrada) / 1000);
      if (segundos >= 5) {
        dispararEventoYRevisar(id, "tiempo_en_pagina", { segundos });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id && idVistaRegistradaRef.current !== id) {
      dispararEventoYRevisar(id, "vista_propiedad");
      idVistaRegistradaRef.current = id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) {
      cargarPropiedad(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const listo = String(propiedad?.id) === String(id);

  return (
    <div className="relative">
      <NavbarHome />
      {listo ? (
        <DetallePropiedad
          inmueble={propiedad}
          onClose={() => {
            if (searchUrl) {
              navigate(searchUrl);
            } else {
              navigate(-1);
            }
          }}
          listaIds={listaIds}
          posicion={posicion}
          total={total}
          filtroLabel={filtroLabel}
          onNavigateTo={onNavigateTo}
        />
      ) : (
        <SmartLoader delay={200} label="Cargando inmueble..." />
      )}

      <BarraNavegacionTauri />
    </div>
  );
};

export default PageAnuncio;
