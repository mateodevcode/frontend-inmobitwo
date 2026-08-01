import { IoIosClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import useTracking from "@/hooks/useTracking";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { CiShare2 } from "react-icons/ci";
import { TiHeartOutline } from "react-icons/ti";
import { FaRegBuilding } from "react-icons/fa";
import { RxRulerSquare } from "react-icons/rx";
import { PiBathtub } from "react-icons/pi";
import { LiaBedSolid } from "react-icons/lia";
import MenuOpciones from "@/components/principal/card-propiedad/MenuOpciones";
import { logo } from "@/data/logo";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import usePropiedades from "../../../hooks/usePropiedades";
import { useAppContext } from "@/context/AppContext.js";
import { useTiempoRelativo } from "@/hooks/useTiempoRelativo";
import HeaderPropiedadId from "./HeaderPropiedadId";
import { HiCheckBadge } from "react-icons/hi2";
import { BiWorld } from "react-icons/bi";
import { getInitials } from "@/lib/getInitials";
import { agruparPorOrden } from "@/utils/galeriaUtils";
import PropertyImage from "@/components/common/PropertyImage";

const AUTOPLAY_SECONDS = 10;

const PropiedadId = () => {
  const {
    propiedad,
    setPropiedadAEliminar,
    setOpenModalConfirmarEliminarPropiedad,
  } = useAppContext();
  const { cargarPropiedad } = usePropiedades();
  const navigate = useNavigate();
  const { id } = useParams();
  const { dispararEventoYRevisar } = useTracking();
  const tiempoEntrada = useRef(Date.now());

  // ─────────────────────────────────────────────
  // tiempo_en_pagina — se registra al desmontar / cambiar de propiedad
  // ─────────────────────────────────────────────
  useEffect(() => {
    tiempoEntrada.current = Date.now();

    return () => {
      const segundos = Math.round((Date.now() - tiempoEntrada.current) / 1000);
      if (segundos >= 5) {
        // ignora vistas de menos de 5 segundos (rebote, no interés real)
        dispararEventoYRevisar(id, "tiempo_en_pagina", { segundos });
      }
    };
  }, [id]);

  // ─────────────────────────────────────────────
  const idVistaRegistradaRef = useRef(null);
  useEffect(() => {
    if (id && idVistaRegistradaRef.current !== id) {
      dispararEventoYRevisar(id, "vista_propiedad");
      idVistaRegistradaRef.current = id;
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      cargarPropiedad(id);
    }
  }, [id]);

  const tiempo = useTiempoRelativo(propiedad.created_at);

  // ─────────────────────────────────────────────
  // Carrusel de imágenes (reciclado de CardPropiedad)
  // ─────────────────────────────────────────────
  // Una "foto" = filas con el mismo orden (5 tamaños). La portada (orden -1)
  // ya viene dentro de galeria y queda primera.
  const fotos = [
    ...agruparPorOrden(propiedad.galeria),
    ...agruparPorOrden(propiedad.planos),
  ].filter((f) => f.tamaños && Object.keys(f.tamaños).length > 0);

  const totalImagenes = fotos.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const autoTimerRef = useRef(null);

  // Si cambiamos de propiedad, volvemos a la primera imagen
  useEffect(() => {
    setCurrentIndex(0);
  }, [id]);

  const goTo = useCallback(
    (index) => {
      if (totalImagenes === 0) return;
      const next = (index + totalImagenes) % totalImagenes;
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(next);
        setFade(true);
      }, 200);
    },
    [totalImagenes],
  );

  const resetAutoPlay = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    if (totalImagenes <= 1) return;

    autoTimerRef.current = setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTOPLAY_SECONDS * 1000);
  }, [currentIndex, goTo, totalImagenes]);

  useEffect(() => {
    resetAutoPlay();
    return () => clearTimeout(autoTimerRef.current);
  }, [currentIndex]); // eslint-disable-line

  const handlePrev = (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  };

  // ─────────────────────────────────────────────
  // Favoritos / Contactar
  // ─────────────────────────────────────────────
  const handleFavorito = (e) => {
    e.stopPropagation();
    // ...tu lógica actual de favoritos...
    dispararEventoYRevisar(id, "favorito_agregado");
  };

  const handleContactar = (e) => {
    e.stopPropagation();
    // ...tu lógica actual de contacto...
    dispararEventoYRevisar(id, "click_telefono");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-end bg-black font-poppins backdrop-blur-sm">
      <div className="w-full h-svh flex flex-col overflow-hidden relative">
        {/* Botón cerrar */}
        <button
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer select-none hover:bg-white/80 absolute top-2 left-2 z-10"
          onClick={() => navigate(-1)}
        >
          <IoIosClose className="text-4xl text-black" />
        </button>

        <div className="flex w-full h-svh">
          {/* Panel negro — imagen grande estilo Facebook */}
          <div className="w-[75%] h-svh flex items-center justify-center relative bg-black">
            {totalImagenes > 0 && (
              <PropertyImage
                foto={fotos[currentIndex]}
                tamañoBase="xlarge"
                sizes="(max-width: 768px) 100vw, 75vw"
                alt={propiedad.titulo}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  opacity: fade ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}

            {/* Badge contador de fotos */}

            <div
              className="flex absolute text-white rounded-md items-center gap-2 top-2 left-14 cursor-pointer select-none"
              onClick={() => {
                navigate("/");
              }}
            >
              <div className="border-black/10 border rounded-full w-10 h-10 flex items-center justify-center shadow-xl bg-white">
                <img src={logo.src} alt={logo.alt} width={25} height={25} />
              </div>
            </div>

            {/* Dots indicadores */}
            {totalImagenes > 1 && (
              <div className="absolute bottom-6 flex gap-1.5 items-center">
                {fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-3 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Flechas prev / next — solo si hay más de 1 imagen */}
            {totalImagenes > 1 && (
              <>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex w-12 h-12 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-3xl cursor-pointer select-none active:scale-95 duration-300 transition"
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex w-12 h-12 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-3xl cursor-pointer select-none active:scale-95 duration-300 transition"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
              </>
            )}
          </div>

          {/* Panel blanco — datos de la propiedad */}
          <div className="w-[25%] h-svh bg-white overflow-y-auto relative">
            <HeaderPropiedadId />
            <div className="flex items-start justify-end p-4 absolute right-2">
              <MenuOpciones
                onVer={() => navigate(`/inmueble/${id}`)}
                onEditar={() => navigate(`/inmueble/${id}/editar`)}
                onEliminar={() => {
                  setPropiedadAEliminar(id);
                  setOpenModalConfirmarEliminarPropiedad(true);
                }}
              />
            </div>

            <div className="p-4">
              {/* Top */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center">
                  {getInitials(propiedad.usuario_nombre)}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-black text-lg items-center gap-2 font-semibold">
                      {propiedad.usuario_nombre}
                    </p>
                    <HiCheckBadge className="text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-black/50">{tiempo}</p>
                    <BiWorld className="text-black" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-4">
                <div className="flex items-center gap-2 text-black/80">
                  <span className="font-semibold text-black">
                    {propiedad.titulo}
                  </span>
                </div>
                <div className="mt-2 text-black font-semibold text-lg font-monserrat">
                  $ 250.000
                </div>

                <div className="mt-2">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Voluptatibus temporibus tempore libero veritatis, a nisi sunt,
                  praesentium neque nesciunt, aspernatur doloremque dolore.
                  Laboriosam, commodi aperiam. Esse vitae temporibus ut et!
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Voluptatibus temporibus tempore libero veritatis, a nisi sunt,
                  praesentium neque nesciunt, aspernatur doloremque dolore.
                  Laboriosam, commodi aperiam. Esse vitae temporibus ut et!
                  <span className="font-semibold mx-2 text-black">
                    Ver menos
                  </span>
                </div>

                <div className="w-full bg-black/10 h-px mt-2 mb-2" />
                <div className="items-center text-black/50 text-xs grid grid-cols-3 gap-2">
                  <div className="flex gap-2 text-base items-center">
                    <LiaBedSolid />
                    <span>4 Hab.</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <PiBathtub />
                    <span>3 Baños</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <RxRulerSquare />
                    <span>140 m°2</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <FaRegBuilding />
                    <span>3° Planta</span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-black/10 h-px mt-2 mb-2" />

              {/* Botones */}
              <div className="mt-4 w-full grid grid-cols-3 gap-2">
                <button
                  className="flex items-center gap-2 bg-white text-black font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition text-xs border border-black/20 p-2 hover:bg-gray-100"
                  type="button"
                  onClick={handleFavorito}
                >
                  <TiHeartOutline className="text-base" />
                  <span>Guardar</span>
                </button>
                <button
                  className="flex items-center gap-2 bg-white text-black font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition text-xs border border-black/20 p-2 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CiShare2 className="text-base" />
                  <span>Compartir</span>
                </button>
                <button
                  className="flex items-center gap-2 bg-white text-black font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition text-xs border border-black/20 p-2 hover:bg-gray-100"
                  onClick={handleContactar}
                >
                  <BsTelephone className="text-base" />
                  <span>Contactar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadId;
