import { useState, useCallback, useEffect, useRef } from "react";
import { HiOutlineTrash, HiOutlineFlag } from "react-icons/hi2";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { BsTelephone, BsCameraFill } from "react-icons/bs";
import { PiChats } from "react-icons/pi";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import useFavoritos from "@/hooks/useFavoritos";
import useTracking from "@/hooks/useTracking";
import { useAppContext } from "@/context/AppContext";
import { useTiempoRelativo } from "@/hooks/useTiempoRelativo";
import { useNavigate, useLocation } from "react-router-dom";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import UbicacionMapa from "./UbicacionMapa";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { ImImage } from "react-icons/im";
import { FaArchway, FaMapMarkerAlt } from "react-icons/fa";
import { Md3dRotation } from "react-icons/md";
import { GoArrowDown } from "react-icons/go";
import { GiHistogram } from "react-icons/gi";
import { AiOutlineEdit } from "react-icons/ai";
import { IoArrowRedoOutline } from "react-icons/io5";
import { BiNotepad } from "react-icons/bi";

const AUTOPLAY_SECONDS = 10;

export default function DetallePropiedad({
  inmueble,
  onClose,
  listaIds,
  posicion,
  total,
  filtroLabel,
  onNavigateTo,
}) {
  const { favoritos } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();
  const { dispararEventoYRevisar } = useTracking();
  const [mostrarTelefono, setMostrarTelefono] = useState(false);
  const [descripcionAbierta, setDescripcionAbierta] = useState(false);

  useEffect(() => {
    const modo = location.state?.abrirFotoVisor;
    if (modo && inmueble?.id) {
      const { abrirFotoVisor, ...restState } = location.state;
      navigate(location.pathname, { replace: true, state: restState });
      const query =
        modo === "mapa" ? "?mapa=1" : modo === "planos" ? "?planos=1" : "";
      navigate(`/inmueble/${inmueble.id}/foto/1${query}`);
    }
  }, [inmueble?.id]);

  // ──────────────────────── Barra sticky al hacer scroll ────────────────────────
  const sentinelRef = useRef(null);
  const [mostrarBarraSticky, setMostrarBarraSticky] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // El sentinel está visible en pantalla: todavía no llegamos
          // al punto de scroll que activa la barra.
          setMostrarBarraSticky(false);
          return;
        }
        // No es visible: puede ser porque todavía no llegamos (está más
        // abajo, boundingClientRect.top > 0) o porque ya lo pasamos
        // scrolleando hacia abajo (se fue por arriba, top < 0).
        // Solo queremos activar la barra en este segundo caso.
        setMostrarBarraSticky(entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ──────────────────────── Carrusel ────────────────────────
  const imagenes = [
    inmueble?.imagen_principal_url,
    ...(inmueble?.galeria || [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
    ...(inmueble?.planos || [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((p) => p.url),
  ].filter(Boolean);

  const totalImagenes = imagenes.length;
  const totalPlanos = (inmueble?.planos || []).length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [inmueble?.id]);

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

  // ──────────────────────── Tracking eventos ────────────────────────
  const handleContactarClick = () => {
    setMostrarTelefono(true);
    if (inmueble?.id) dispararEventoYRevisar(inmueble.id, "click_telefono");
  };

  const handleCompartirClick = () => {
    if (inmueble?.id) dispararEventoYRevisar(inmueble.id, "click_compartir");
  };

  const tiempo = useTiempoRelativo(inmueble?.created_at);

  // ──────────────────────── Early return ────────────────────────
  if (!inmueble) return null;

  const isFavorited = estaEnFavoritos(favoritos, inmueble.id);

  const specsLinea = [
    inmueble.area_m2 ? `${inmueble.area_m2} m²` : null,
    inmueble.habitaciones ? `${inmueble.habitaciones} hab.` : null,
    inmueble.planta
      ? `${inmueble.planta} planta ${inmueble.exterior ? "exterior" : "interior"}${inmueble.ascensor ? " con ascensor" : ""}`
      : null,
  ].filter(Boolean);

  const descripcionLarga = inmueble.descripcion || "";
  const descripcionCorta = descripcionLarga.slice(0, 280);
  const necesitaTruncar = descripcionLarga.length > 280;

  return (
    <div className="bg-gray-100 relative">
      {/* ──── Barra sticky (aparece al scrollear pasado el bloque de precio) ──── */}
      <div
        className={`fixed top-0 left-0 right-0 z-1200 bg-white shadow-md transition-all duration-300 ease-out ${
          mostrarBarraSticky
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-5 py-2.5 font-poppins bg-amber-400">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-700 shrink-0"
              title="Volver"
            >
              <MdOutlineKeyboardDoubleArrowLeft className="text-2xl" />
            </button>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">
                {inmueble.titulo}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {formatPrecioCompleto(inmueble.precio)}
                {inmueble.operacion === "alquiler" ? "/mes" : ""}
                {specsLinea.length > 0 ? ` · ${specsLinea.join(" · ")}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={(e) => handleFavorito(e, inmueble.id)}
              className="flex items-center gap-1.5 border-2 border-black/80 rounded-sm px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
            >
              {isFavorited ? (
                <TiHeartFullOutline className="text-base text-[#e6007a]" />
              ) : (
                <TiHeartOutline className="text-base" />
              )}
              <span className="hidden sm:inline">Guardar</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
              <HiOutlineTrash className="text-base" />
              <span className="hidden sm:inline">Descartar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ──── Botón cerrar (barra superior existente) ──── */}
      <div className="w-full md:h-12 h-24 bg-white flex items-center">
        <div className="mx-auto w-9/12 flex items-center md:flex-row flex-col justify-between gap-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer select-none gap-2 font-poppins text-blue-600 hover:underline hover:text-blue-700"
          >
            <MdOutlineKeyboardDoubleArrowLeft className="text-2xl shrink-0" />
            <span className="truncate">
              {filtroLabel || "Volver a resultados"}
            </span>
          </button>

          {listaIds && listaIds.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTo("anterior")}
                disabled={posicion <= 0}
                className="flex items-center justify-center cursor-pointer select-none gap-1 font-poppins text-blue-600 hover:underline hover:text-blue-700 disabled:text-gray-300 disabled:cursor-default disabled:no-underline"
              >
                <MdOutlineKeyboardArrowLeft className="text-2xl" />
                <span className="text-sm">Anterior</span>
              </button>

              <p className="text-sm text-gray-500 whitespace-nowrap">
                {posicion + 1} de {total || listaIds.length} viviendas
              </p>

              <button
                onClick={() => onNavigateTo("siguiente")}
                disabled={posicion >= (total || listaIds.length) - 1}
                className="flex items-center justify-center cursor-pointer select-none gap-1 font-poppins text-blue-600 hover:underline hover:text-blue-700 disabled:text-gray-300 disabled:cursor-default disabled:no-underline"
              >
                <span className="text-sm">Siguiente</span>
                <MdOutlineKeyboardArrowRight className="text-2xl" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 max-w-4xl mx-auto">
        {/* ──── Columna principal ──── */}
        <div className="min-w-0 bg-white px-5 font-poppins">
          {/* Carousel de imágenes */}
          <div className="relative w-full h-105 bg-gray-100 overflow-hidden">
            {totalImagenes > 0 && (
              <img
                src={imagenes[currentIndex]}
                alt={inmueble.titulo}
                className="w-full h-full object-cover select-none cursor-pointer"
                onClick={() =>
                  navigate(`/inmueble/${inmueble.id}/foto/${currentIndex + 1}`)
                }
                style={{
                  opacity: fade ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}

            {/* Dots indicadores */}
            {totalImagenes > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
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

            {/* Contador */}
            {totalImagenes > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-2 rounded">
                {currentIndex + 1}/{totalImagenes}
              </div>
            )}

            {/* Flechas prev / next */}
            {totalImagenes > 1 && (
              <>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex w-9 h-9 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-xl cursor-pointer select-none active:scale-95 duration-300 transition"
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex w-9 h-9 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-xl cursor-pointer select-none active:scale-95 duration-300 transition"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3">
            <button
              onClick={() => navigate(`/inmueble/${inmueble.id}/foto/1`)}
              className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer"
            >
              <ImImage className="text-base" />
              {totalImagenes} fotos
            </button>
            {totalPlanos > 0 && (
              <button
                onClick={() =>
                  navigate(`/inmueble/${inmueble.id}/foto/1?planos=1`)
                }
                className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer"
              >
                <FaArchway /> {totalPlanos} planos
              </button>
            )}
            <button
              onClick={() =>
                document
                  .getElementById("tour-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer"
            >
              <Md3dRotation /> Vista 3D
            </button>
            <button
              onClick={() => navigate(`/inmueble/${inmueble.id}/foto/1?mapa=1`)}
              className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer"
            >
              <FaMapMarkerAlt /> Mapa
            </button>
          </div>

          {/* Título, ubicación, precio, specs */}
          <div className="mt-4 pb-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-montserrat">
                  Piso en venta en calle 17
                </h1>
                <div className="flex md:items-center items-start gap-2 md:flex-row flex-col">
                  <p className="text-black/60 md:text-base text-sm">
                    Auditorio-Seminario-Parque de Invierno, Oviedo
                  </p>
                  <div className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer select-none md:text-base text-sm">
                    <FaMapMarkerAlt className="" />
                    <span className="text-sm">Ver mapa</span>
                  </div>
                </div>
                <p className="text-xs text-rose-600 mt-2">{tiempo}</p>
              </div>
            </div>

            <div className="flex md:items-center gap-2 mt-3 md:flex-row flex-col items-start">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 font-montserrat">
                  {formatPrecioCompleto(inmueble.precio)}
                </p>
                {inmueble.operacion === "alquiler" && (
                  <p className="text-base text-gray-500">/mes</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold font-montserrat ml-2 text-red-600 line-through">
                  {formatPrecioCompleto(28000000)}
                </p>
                <div className="flex items-center text-red-600">
                  <GoArrowDown />
                  <p className="text-lg font-semibold font-montserrat ml-1">
                    {((inmueble.precio / 280000000) * 100).toFixed()} %
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4">
              <div className="text-blue-600 hover:underline flex items-center gap-2">
                <GiHistogram />
                <p className="text-sm">Calcular hipoteca</p>
              </div>

              <div className="text-blue-600 hover:underline flex items-center gap-2">
                <AiOutlineEdit />
                <p className="text-sm">Calcular hipoteca</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:text-base text-sm">
              <span>90 m2</span>
              <div className="w-px h-5 bg-black/40" />
              <span>3 hab.</span>
              <div className="w-px h-5 bg-black/40" />
              <span>3° planta exterior con asensor</span>
            </div>

            {specsLinea.length > 0 && (
              <p className="text-sm text-gray-700 mt-2">
                {specsLinea.join(" · ")}
              </p>
            )}

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={(e) => handleFavorito(e, inmueble.id)}
                className="flex items-center gap-2 border-2 border-black/80 rounded-sm px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                {isFavorited ? (
                  <TiHeartFullOutline className="text-lg text-[#e6007a]" />
                ) : (
                  <TiHeartOutline className="text-lg" />
                )}
                Guardar favorito
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <HiOutlineTrash className="text-lg" />
                <span className="hidden md:flex">Descartar</span>
              </button>
              <button
                onClick={handleCompartirClick}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                <IoArrowRedoOutline className="text-lg" />
                <span className="hidden md:flex">Compartir</span>
              </button>
            </div>
          </div>

          {/* Sentinel: cuando esto sale del viewport por arriba, se activa la barra sticky */}
          <div ref={sentinelRef} />

          <div className="bg-orange-50 w-full h-16 flex items-center px-6 text-blue-600 gap-2 hover:underline">
            <BiNotepad className="text-lg" />
            <p className="text-sm font-semibold">Añadir tu nota</p>
          </div>

          {/* Descripción */}
          {/* {descripcionLarga && ( */}
          {true && (
            <div className="py-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Descripción
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {/* {descripcionAbierta ? descripcionLarga : descripcionCorta}
                {!descripcionAbierta && necesitaTruncar ? "..." : ""} */}
                Piso en venta en zona Seminario, Oviedo (Asturias, España).
                Precio: 299.000 €. Superficie construida: 90 m². 3 habitaciones
                y 2 baños. 3ª planta exterior. Tour virtual 3D disponible. Piso
                en venta situado muy cerca del Seminario y del Parque de
                Invierno, en Oviedo. Está ubicado en la tercera planta de un
                edificio construido en 1991, sin barreras arquitectónicas y que
                cuenta con portal reformado y ascensor. La vivienda, que se
                encuentra en buen estado, tiene una superficie construida de 90
                m² distribuidos en hall de entrada, salón comedor, cocina
                amueblada, tres habitaciones y dos baños completos. Dispone de
                calefacción individual de gas natural, suelos de parquet y gres,
                ventanas de doble acristalamiento, puerta de seguridad,
                videoportero, etc. Es exterior y muy luminoso, con orientación
                sureste. Gastos de comunidad: 77 € al mes.
              </p>
              {necesitaTruncar && (
                <button
                  onClick={() => setDescripcionAbierta((v) => !v)}
                  className="text-sm font-semibold text-blue-600 hover:underline mt-2"
                >
                  {descripcionAbierta
                    ? "Leer menos"
                    : "Leer descripción completa"}
                </button>
              )}

              {/* {inmueble.contacto_nombre && ( */}
              {true && (
                <div className="text-sm text-gray-600 mt-4 flex items-center gap-2 border-t border-black/10 pt-4">
                  <PiChats className="text-base" />
                  Si tenés alguna duda podés hablar con{" "}
                  <span className="font-semibold">
                    {inmueble.contacto_nombre}
                  </span>{" "}
                  por chat.
                </div>
              )}
            </div>
          )}

          {/* Características básicas */}
          <div className="py-5 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Características básicas
                </h2>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  {inmueble.area_m2 && (
                    <li>· {inmueble.area_m2} m² construidos</li>
                  )}
                  {inmueble.habitaciones != null && (
                    <li>· {inmueble.habitaciones} habitaciones</li>
                  )}
                  {inmueble.banos != null && <li>· {inmueble.banos} baños</li>}
                  {inmueble.balcon && <li>· Balcón</li>}
                  {inmueble.estado && <li>· {inmueble.estado}</li>}
                  {inmueble.armarios_empotrados && (
                    <li>· Armarios empotrados</li>
                  )}
                  {inmueble.orientacion && (
                    <li>· Orientación {inmueble.orientacion}</li>
                  )}
                  {inmueble.anno_construccion && (
                    <li>· Construido en {inmueble.anno_construccion}</li>
                  )}
                  {inmueble.amueblado && <li>· Amueblado y cocina equipada</li>}
                  {inmueble.calefaccion && (
                    <li>· Calefacción {inmueble.calefaccion}</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Certificado energético
                </h2>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  <li>· {inmueble.certificado_energetico || "No indicado"}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fotos completas */}
          {totalImagenes > 0 && (
            <div id="fotos-section" className="py-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BsCameraFill className="text-base" />
                Fotos
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {imagenes.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-full rounded-sm object-cover cursor-pointer"
                    onClick={() =>
                      navigate(`/inmueble/${inmueble.id}/foto/${i + 1}`)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reportar error */}
          <div className="py-5 border-b border-gray-200">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <HiOutlineFlag className="text-base" />
              ¿Hay algún error en este anuncio?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Infórmanos para corregirlo y ayudar a otras personas.
            </p>
            <button className="text-sm font-semibold text-blue-600 hover:underline mt-1">
              Cuéntanos qué error has visto
            </button>
          </div>

          {/* Precio */}
          <div className="py-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Precio</h2>
            <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
              <span>Precio del inmueble:</span>
              <span className="font-bold text-gray-900">
                {formatPrecioCompleto(inmueble.precio)}
                {inmueble.operacion === "alquiler" ? "/mes" : ""}
              </span>
            </div>
            {inmueble.area_m2 > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                <span>Precio por m²:</span>
                <span>
                  {(inmueble.precio / inmueble.area_m2).toLocaleString(
                    "es-CO",
                    { maximumFractionDigits: 0 },
                  )}{" "}
                  /m²
                </span>
              </div>
            )}
            {inmueble.fianza_meses && (
              <p className="text-sm text-gray-700">
                Fianza de {inmueble.fianza_meses} mes
                {inmueble.fianza_meses > 1 ? "es" : ""}
              </p>
            )}
          </div>

          {/* Ubicación */}
          {inmueble.latitude && inmueble.longitude && (
            <div
              id="ubicacion-section"
              className="py-5 border-b border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Ubicación
              </h2>
              <div className="text-sm text-gray-700 space-y-0.5 mb-3">
                {inmueble.direccion && <p>{inmueble.direccion}</p>}
                {inmueble.barrio_name && <p>Barrio {inmueble.barrio_name}</p>}
                {inmueble.city_name && (
                  <p>
                    {inmueble.city_name}
                    {inmueble.state_name ? `, ${inmueble.state_name}` : ""}
                  </p>
                )}
              </div>
              <UbicacionMapa lat={inmueble.latitude} lng={inmueble.longitude} />
            </div>
          )}

          {/* Estadísticas */}
          <div className="py-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Estadísticas
            </h2>
            {inmueble.fecha_actualizacion && (
              <p className="text-sm text-gray-700">
                Anuncio actualizado el{" "}
                {new Date(inmueble.fecha_actualizacion).toLocaleDateString(
                  "es-CO",
                  { day: "numeric", month: "long" },
                )}
              </p>
            )}
          </div>
        </div>

        {/* ──── Sidebar de contacto (sticky) ──── */}
        <div className="lg:sticky lg:top-4 h-fit bg-white mt-4 font-poppins">
          <div className="border-t-4 border-[#e6007a] shadow-md bg-white">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center text-lg">
                Pregunta al{" "}
                {inmueble.tipo === "organizacion" ? "anunciante" : "vendedor"}
              </h3>

              <div className="flex items-start gap-2 border-2 border-blue-300 bg-blue-50 rounded-sm p-3 mb-3">
                <TbAlertOctagonFilled className="text-lg text-black/80 shrink-0" />
                <p className="text-sm text-black/80">
                  Contactá directamente para agendar una visita o resolver
                  dudas.
                </p>
              </div>

              <button className="w-full bg-[#e6007a] text-white text-sm font-bold rounded-sm py-2.5 hover:bg-[#c40068] transition-colors mb-4 flex items-center gap-2 justify-center">
                <PiChats className="text-2xl" />
                Contactar por chat
              </button>

              <div className="border-t border-gray-100 pt-3">
                {mostrarTelefono ? (
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BsTelephone className="text-base" />
                    {inmueble.telefono_contacto || "No disponible"}
                  </p>
                ) : (
                  <button
                    onClick={handleContactarClick}
                    className="flex items-center gap-2 font-semibold text-blue-600 hover:underline"
                  >
                    <BsTelephone className="text-base" />
                    Ver teléfono
                  </button>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Referencia del anuncio
                </p>
                <p className="text-sm text-gray-800">{inmueble.id}</p>

                <p className="text-xs text-gray-500 mt-4">Profesional</p>
                <p className="text-sm text-gray-800">Sellmi</p>

                <div className="border-t border-black/20 mt-4">
                  {inmueble?.es_de_organizacion && (
                    <div className="flex items-center w-full justify-between pt-4">
                      <div className="">
                        <p className="text-sm text-blue-600 font-medium">
                          Sellmi
                        </p>
                        <p className="text-sm text-black/70 font-medium">
                          Oviedo
                        </p>
                      </div>

                      <div className="border border-segundo/10 w-32 h-16">
                        <img
                          src={
                            inmueble?.organizacion_logo_url ||
                            "/logo/logo-hor.png"
                          }
                          alt={inmueble?.organizacion_nombre || "Inmobiliaria"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
