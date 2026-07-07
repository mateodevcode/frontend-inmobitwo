import { BsGeoAlt, BsTelephone } from "react-icons/bs";
import { CiShare2 } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { LiaBedSolid } from "react-icons/lia";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlinePhotoCamera,
} from "react-icons/md";
import { PiBathtub } from "react-icons/pi";
import { RxRulerSquare } from "react-icons/rx";
import { TbPointFilled } from "react-icons/tb";
import { TiHeartOutline } from "react-icons/ti";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import MenuOpciones from "@/components/principal/MenuOpciones";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import { useAppContext } from "@/context/AppContext";
import { useTiempoRelativo } from "@/hooks/useTiempoRelativo";
import useTracking from "../../hooks/useTracking";

const AUTOPLAY_SECONDS = 10;

const CardPropiedad = ({ propiedades, ultimaCardRef, esLaUltima }) => {
  const {
    id,
    titulo,
    imagen_principal_url,
    estado,
    galeria = [],
    publicado_por_id,
    publicador,
    tiempo_relativo,
    created_at,
  } = propiedades;

  const tiempo = useTiempoRelativo(created_at);
  // 👇 dispararEventoYRevisar en vez de registrarEvento: además de registrar
  // el evento, revisa la respuesta y abre el ModalContactoLead si se generó
  // un lead sin datos de contacto.
  const { dispararEventoYRevisar } = useTracking();
  const vistaRegistrada = useRef(false);

  const navigate = useNavigate();
  const { setOpenModalConfirmarEliminarPropiedad, setPropiedadAEliminar } =
    useAppContext();

  const imagenes = [
    imagen_principal_url,
    ...galeria
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
  ].filter(Boolean);

  const totalImagenes = imagenes.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const goTo = useCallback(
    (index) => {
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
    // Limpiar timers anteriores
    clearTimeout(autoTimerRef.current);
    clearInterval(progressIntervalRef.current);

    setProgress(0);

    if (totalImagenes <= 1) return;

    // Progress bar tick cada 100ms
    let elapsed = 0;
    progressIntervalRef.current = setInterval(() => {
      elapsed += 100;
      setProgress((elapsed / (AUTOPLAY_SECONDS * 1000)) * 100);
    }, 100);

    // Auto-avance cada 10s
    autoTimerRef.current = setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTOPLAY_SECONDS * 1000);
  }, [currentIndex, goTo, totalImagenes]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      clearTimeout(autoTimerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex]); // eslint-disable-line

  const handlePrev = (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  };
  const color = getColorForOrg(publicador.id);

  const handleFavorito = (e) => {
    e.stopPropagation();
    // ...tu lógica actual de favoritos...
    dispararEventoYRevisar(propiedades.id, "favorito_agregado");
  };

  const handleContactar = (e) => {
    e.stopPropagation();
    // ...tu lógica actual de contacto...
    dispararEventoYRevisar(propiedades.id, "click_telefono");
  };

  return (
    <div
      className="font-poppins border border-black/20 rounded-md bg-white"
      key={propiedades.id}
      ref={esLaUltima ? ultimaCardRef : null}
      // 👇 Bug #1: se sacó el tracking de vista_propiedad de acá. La card del
      // listado NO debe contar como "vista" de la propiedad — eso vive
      // exclusivamente en la página de detalle (PropiedadId.jsx), donde el
      // usuario realmente entra a ver la ficha completa. Tenerlo acá además
      // generaba falsos positivos: cualquier click en Guardar/Contactar/
      // flechas del carrusel burbujeaba hasta este div y contaba como vista.
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="flex gap-2">
          <div
            className={`flex items-center justify-center p-2 w-10 h-10 rounded-md font-semibold uppercase ${color.text} ${color.bg}`}
          >
            {getInitials(publicador.name)}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-black">
              {formatFirstTwoNames(publicador.name)}
            </p>
            <div className="flex text-xs gap-1 items-center justify-center">
              <span>{tiempo}</span>
              <TbPointFilled />
              <span>Madrid</span>,<span>Asturias</span>
            </div>
          </div>
        </div>
        <MenuOpciones
          onVer={() => navigate(`/propiedades/${id}`)}
          onEditar={() => navigate(`/propiedades/${id}/editar`)}
          onEliminar={() => {
            setPropiedadAEliminar(id);
            setOpenModalConfirmarEliminarPropiedad(true);
          }}
        />
      </div>

      {/* Imagen */}
      <div className="relative">
        {/* Imagen con fade */}
        <img
          src={imagenes[currentIndex]}
          alt={titulo}
          onClick={() => navigate(`/propiedades/${id}`)}
          className="w-full h-72 object-cover cursor-pointer"
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Progress bar */}
        {totalImagenes > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
            <div
              className="h-full bg-white/80 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Badge fotos */}
        <div className="flex bg-black/50 absolute text-white text-xs px-2 py-1.5 rounded-md items-center gap-2 top-2 left-2">
          <MdOutlinePhotoCamera />
          <span>
            {currentIndex + 1} / {totalImagenes}{" "}
            {totalImagenes === 1 ? "foto" : "fotos"}
          </span>
        </div>

        {/* icons */}
        <div className="flex bg-white absolute text-black text-xs px-4 py-1.5 rounded-full items-center gap-2 top-2 right-2 font-semibold">
          {estado}
        </div>
        <div className="flex bg-black absolute text-white px-4 py-2 rounded-md items-center gap-2 bottom-2 left-2 font-bold font-montserrat">
          $ 250.000
        </div>

        {/* Dots indicadores */}
        {totalImagenes > 1 && (
          <div className="absolute bottom-4 right-2 flex gap-1.5 items-center">
            {imagenes.map((_, i) => (
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

        {/* Botones prev / next — solo si hay más de 1 imagen */}
        {totalImagenes > 1 && (
          <>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleNext}
                className="flex w-10 h-10 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-2xl cursor-pointer select-none active:scale-95 duration-300 transition"
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handlePrev}
                className="flex w-10 h-10 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-2xl cursor-pointer select-none active:scale-95 duration-300 transition"
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
            </div>
          </>
        )}
      </div>

      {/* detalles */}
      <div className="flex flex-col p-4">
        <div className="">
          <p className="font-semibold text-black">Madrid</p>
          <div className="flex items-center gap-2 text-xs text-black/80">
            <BsGeoAlt />
            <span>{propiedades.titulo}</span>
          </div>
        </div>
        <div className="w-full bg-black/10 h-px mt-2 mb-2"></div>
        <div className="flex items-center text-black text-xs gap-4">
          <div className="flex gap-2">
            <LiaBedSolid />
            <span>4 Hab.</span>
          </div>
          <div className="flex gap-2">
            <PiBathtub />
            <span>3 Baños</span>
          </div>
          <div className="flex gap-2">
            <RxRulerSquare />
            <span>140 m°2</span>
          </div>
          <div className="flex gap-2">
            <FaRegBuilding />
            <span>3° Planta</span>
          </div>
        </div>
        <div className="w-full bg-black/10 h-px mt-2"></div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <button
          className="flex items-center justify-center gap-2 bg-white border border-black/20 text-black rounded-md px-2 py-1.5 font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition hover:bg-black/5 text-xs md:text-base"
          type="button"
          onClick={handleFavorito}
        >
          <TiHeartOutline className="text-base md:text-lg" />
          <span>Guardar</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-white border border-black/20 text-black rounded-md px-2 py-1.5 font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition hover:bg-black/5 text-xs md:text-base"
          onClick={(e) => e.stopPropagation()}
        >
          <CiShare2 className="text-base md:text-lg" />
          <span>Compartir</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-white border border-black/20 text-black rounded-md px-2 py-1.5 font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition hover:bg-black/5 text-xs md:text-base"
          onClick={handleContactar}
        >
          <BsTelephone className="text-base md:text-lg" />
          <span>Contactar</span>
        </button>
      </div>
    </div>
  );
};

export default CardPropiedad;
