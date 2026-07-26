import { useParams, useNavigate } from "react-router-dom";
import NavbarHome from "../inicio/NavbarHome";
import DetallePropiedad from "./DetallePropiedad";
import { useEffect, useRef } from "react";
import usePropiedades from "../../hooks/usePropiedades";
import { useAppContext } from "@/context/AppContext.js";
import useTracking from "@/hooks/useTracking";

const PageAnuncio = () => {
  const { id } = useParams();
  const { cargarPropiedad } = usePropiedades();
  const {
    propiedad,
    setPropiedadAEliminar,
    setOpenModalConfirmarEliminarPropiedad,
  } = useAppContext();
  const navigate = useNavigate();
  const { dispararEventoYRevisar } = useTracking();

  const idVistaRegistradaRef = useRef(null);

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
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default PageAnuncio;
