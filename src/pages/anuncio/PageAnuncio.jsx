import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavbarHome from "../inicio/NavbarHome";
import DetallePropiedad from "./DetallePropiedad";
import { useEffect, useRef, useCallback } from "react";
import usePropiedades from "../../hooks/usePropiedades";
import { useAppContext } from "@/context/AppContext.js";
import useTracking from "@/hooks/useTracking";

const PageAnuncio = () => {
  const { id } = useParams();
  const location = useLocation();
  const { cargarPropiedad } = usePropiedades();
  const {
    propiedad,
    setPropiedadAEliminar,
    setOpenModalConfirmarEliminarPropiedad,
  } = useAppContext();
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
  }, [id]);

  return (
    <div>
      <NavbarHome />
      <DetallePropiedad
        inmueble={propiedad}
        onVer={() => navigate(`/inmueble/${id}`)}
        onEditar={() => navigate(`/inmueble/${id}/editar`)}
        onEliminar={() => {
          setPropiedadAEliminar(id);
          setOpenModalConfirmarEliminarPropiedad(true);
        }}
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
    </div>
  );
};

export default PageAnuncio;
