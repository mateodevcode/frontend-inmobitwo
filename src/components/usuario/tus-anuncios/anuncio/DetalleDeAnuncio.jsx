import HeaderInmobitwo from "@/pages/publicar-anuncio-info/components/HeaderInmobitwo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineModeEdit,
  MdOutlinePhotoCamera,
} from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext.js";
import { useEffect, useRef, useState } from "react";
import usePropiedades from "@/hooks/usePropiedades";
import SkeletonDetalleAnuncio from "./SkeletonDetalleAnuncio";
import useTracking from "../../../../hooks/useTracking";
import { irArriba } from "@/utils/irArriba";

const DetalleDeAnuncio = () => {
  const navigate = useNavigate();
  const { propiedad, cargandoGlobal } = useAppContext();
  const { actualizarPropiedad, cargarPropiedad } = usePropiedades();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const segmento = location.pathname.split("/usuario/mis-anuncios/anuncio/")[1];

  const { id } = useParams();
  const { registrarEvento } = useTracking();
  const tiempoEntrada = useRef(Date.now());

  useEffect(() => {
    tiempoEntrada.current = Date.now();

    // Al desmontar (usuario sale de la página), registra cuánto tiempo estuvo
    return () => {
      const segundos = Math.round((Date.now() - tiempoEntrada.current) / 1000);
      if (segundos >= 5) {
        // ignora vistas de menos de 5 segundos (rebote, no interés real)
        registrarEvento(id, "tiempo_en_pagina", { segundos });
      }
    };
  }, [id]);

  useEffect(() => {
    if (segmento) {
      // Hay id en la URL => flujo normal, traer datos y saltar a paso 2
      cargarPropiedad(segmento);
      return;
    }
  }, [segmento]);

  if (cargandoGlobal)
    return (
      <div className="flex flex-col font-montserrat relative items-center mb-20">
        <HeaderInmobitwo />
        <div className="w-full">
          <SkeletonDetalleAnuncio />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col font-montserrat relative items-center mb-20">
      <HeaderInmobitwo />

      {/* Header */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-between mx-auto py-4 w-11/12 md:w-10/12">
          <button
            className="font-semibold text-blue-700 flex items-center gap-4 cursor-pointer select-none hover:text-blue-600"
            onClick={() => {
              navigate("/usuario/mis-anuncios");
              irArriba();
            }}
          >
            <MdOutlineKeyboardDoubleArrowLeft className="text-4xl" />
            <p className="text-xl md:flex hidden">Volver a tus anuncios</p>
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById("top-detalles")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              navigate("/info/publicar-anuncio");
            }}
            className="font-poppins rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-semibold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
          >
            Poner otro anuncio
          </button>
        </div>
      </div>

      {/* Datos principales */}
      <div className="w-full py-5">
        <div className="w-10/12 mx-auto">
          <p className="text-xl md:text-3xl font-bold text-black">
            {`${propiedad?.operacion} de ${propiedad?.titulo}, 34 (Cod. ${propiedad?.id})`}
          </p>
          <div className="bg-stone-100 w-72 mt-4 p-2 px-4 border border-black/20">
            <p className="font-semibold">
              {propiedad.estado === "publicado"
                ? "Anuncio publicado"
                : "Anuncio no publicado"}
            </p>
          </div>
          <p className="mt-4 text-black text-lg">
            {`Anuncio gratuito. (Cod. ${propiedad?.id})`}
          </p>

          <button
            type="button"
            onClick={async (e) => {
              if (propiedad.estado === "publicado") {
                await actualizarPropiedad(e, propiedad.id, setLoading, {
                  estado: "no_publicado",
                });
                cargarPropiedad(propiedad.id);
              } else {
                await actualizarPropiedad(e, propiedad.id, setLoading, {
                  estado: "publicado",
                });
                cargarPropiedad(propiedad.id);
              }
            }}
            className="rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none mt-4 md:mt-8"
          >
            {propiedad.estado === "publicado"
              ? "Desactivar"
              : "Reactivar gratis"}
          </button>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">
              Precio y características
            </h3>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <p className="text-black font-bold">400€/mes</p>
              <div className="w-0.5 h-6 bg-black/40" />
              <p className="text-black">72 m² </p>
              <div className="w-0.5 h-6 bg-black/40" />
              <p className="text-black">2 hab. </p>
              <div className="w-0.5 h-6 bg-black/40" />
              <p className="text-black">2ª planta </p>
              <p className="text-black">1 baño </p>
              <div className="w-0.5 h-6 bg-black/40" />
              <p className="text-black">interior</p>
            </div>
          </div>

          <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600 mt-4">
            <MdOutlineModeEdit className="text-xl" />
            <p className="font-semibold text-sm md:text-lg">
              Modificar precio y datos
            </p>
          </button>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <h3 className="text-xl font-bold text-black">Fotos y vídeos</h3>
          <div className="bg-rose-100 p-6 mt-4">
            <p className="text-rose-800 font-bold text-xl">
              Tu anuncio no tiene fotos
            </p>
            <p className="text-lg mt-2 text-black">
              Tu anuncio recibirá un 90% menos de contactos que los que tienen
              fotos.
            </p>
          </div>

          <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600 mt-4">
            <MdOutlinePhotoCamera className="text-xl" />
            <p className="font-semibold text-sm md:text-lg">
              Añadir tus fotos para recibir más contactos
            </p>
          </button>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">Estadísticas</h3>

            <p className="text-lg text-black mt-4">
              Publicado por última vez el 20/06/2026.
            </p>
            <div className="flex items-center gap-4 md:gap-8 mt-4 flex-wrap">
              <div className="text-black flex items-center gap-4 text-xl">
                <IoEyeOutline />
                <p>Vistas</p>
                <p className="font-bold">2</p>
              </div>

              <div className="text-black flex items-center gap-4 text-xl">
                <FaRegHeart />
                <p>Vistas</p>
                <p className="font-bold">0</p>
              </div>

              <div className="text-black flex items-center gap-4 text-xl">
                <MdOutlineMarkUnreadChatAlt />
                <p>Vistas</p>
                <p className="font-bold">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">Forma de contacto</h3>
            <div className="flex items-center gap-10 mt-8 flex-col">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4 text-black">
                  <BsTelephone className="text-xl" />
                  <p className="text-lg">675464502</p>
                </div>

                <div className="flex items-center gap-2 text-green-800 text-lg">
                  <FaCheck />
                  <p>Activo</p>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4 text-black">
                  <MdOutlineMarkUnreadChatAlt className="text-xl" />
                  <p className="text-lg">Mensajes de chat</p>
                </div>

                <div className="flex items-center gap-2 text-green-800 text-lg">
                  <FaCheck />
                  <p>Activo</p>
                </div>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600 mt-8">
            <MdOutlineModeEdit className="text-xl" />
            <p className="font-semibold text-sm md:text-lg">Cambiar contacto</p>
          </button>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">Dirección</h3>
            <p className="text-lg text-black mt-4">
              Alquiler residencial de piso en calle vaqueiros de alzada, 34,2ª
              planta, Puerta A, Tineo
            </p>
          </div>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">Descripción</h3>
            <p className="text-lg text-black mt-4">
              Todavía no has escrito un comentario
            </p>
          </div>

          <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600 mt-4">
            <MdOutlineModeEdit className="text-xl" />
            <p className="font-semibold text-sm md:text-lg">
              Editar descripción o cambiar idioma
            </p>
          </button>
        </div>
      </div>

      <div className="w-10/12">
        <div className="w-full md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
          <div>
            <h3 className="text-xl font-bold text-black">
              Servicios aplicados a este anuncio
            </h3>
            <p className="text-lg text-black mt-4">
              Actualmente no tienes productos contratados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDeAnuncio;
