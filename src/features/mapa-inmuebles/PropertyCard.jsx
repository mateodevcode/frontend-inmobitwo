import { useCallback, useEffect, useRef, useState } from "react";
import { FaArchway } from "react-icons/fa6";
import { FiVideo } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi2";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { PiChats } from "react-icons/pi";
import { BsFillGeoAltFill, BsTelephone } from "react-icons/bs";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import useFavoritos from "@/hooks/useFavoritos";
import { formatPrecioCompleto } from "@/utils/formatPrecio";

const AUTOPLAY_SECONDS = 10;

const TIPO_BADGE = {
  piso: "Piso",
  chalet: "Casa o chalet",
  rustica: "Casa rústica",
  habitacion: "Habitación",
  oficina: "Oficina",
  local: "Local",
  garaje: "Garaje",
  terreno: "Terreno",
  edificio: "Edificio",
  "obra-nueva": "Obra nueva",
  vacacional: "Vacacional",
};

const OPERACION_LABEL = {
  venta: "Venta",
  alquiler: "Alquiler",
};

export function PropertyCard({ inmueble, onClose }) {
  const navigate = useNavigate();
  const { favoritos } = useAppContext();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoTimerRef = useRef(null);

  const imagenPrincipal =
    inmueble?.imagen_principal_url || "/propiedades/chalet.jpg";
  const titulo = inmueble?.titulo || "Sin título";
  const ubicacion = inmueble?.city_name
    ? `${inmueble.city_name}, ${inmueble.state_name}`
    : "";
  const tipoLabel = TIPO_BADGE[inmueble?.tipo] || inmueble?.tipo || "";
  const operacionLabel =
    OPERACION_LABEL[inmueble?.operacion] || inmueble?.operacion || "";

  const galeria = inmueble?.galeria || [];
  const planos = inmueble?.planos || [];

  const imagenes = [
    imagenPrincipal,
    ...galeria
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
    ...planos
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((p) => p.url),
  ];
  const totalImagenes = imagenes.length;
  const isFavorited = estaEnFavoritos(favoritos, inmueble?.id);

  const goTo = useCallback(
    (index) => {
      setCurrentIndex((index + totalImagenes) % totalImagenes);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Resetear al cambiar de inmueble seleccionado
  useEffect(() => {
    setCurrentIndex(0);
  }, [inmueble?.id]);

  if (!inmueble) return null;

  return (
    <div className="absolute top-16 right-4 z-1000 w-80 bg-white shadow-xl overflow-hidden">
      {/* ──── Imagen ──── */}
      <div className="relative w-full h-48 bg-gray-100 group">
        <img
          src={imagenes[currentIndex]}
          alt={titulo}
          className="w-full h-full object-cover"
        />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-white"
          title="Cerrar"
        >
          ✕
        </button>

        <div className="absolute left-2 bottom-2 flex items-center justify-center gap-2">
          <div className="bg-white hover:bg-white/70 rounded p-2 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <FaArchway className="text-sm text-black" />
          </div>
          <div className="bg-white hover:bg-white/70 rounded p-2 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <FiVideo className="text-sm text-black" />
          </div>
          <div className="bg-white hover:bg-white/70 rounded p-2 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <BsFillGeoAltFill className="text-sm text-black" />
          </div>
        </div>

        {totalImagenes > 1 && (
          <>
            <div
              className="absolute left-1 top-1/2 -translate-y-1/2 hover:bg-white/80 rounded-full p-1.5 text-white hover:text-black transition duration-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex - 1);
              }}
            >
              <MdOutlineKeyboardArrowLeft className="text-2xl" />
            </div>
            <div
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-white/80 rounded-full p-1.5 text-white hover:text-black transition duration-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex + 1);
              }}
            >
              <MdOutlineKeyboardArrowRight className="text-2xl" />
            </div>
          </>
        )}

        <div className="bg-black/70 absolute bottom-2 right-2 p-1 px-2 rounded-md">
          <span className="text-white/90 font-semibold text-xs">
            {currentIndex + 1}/{totalImagenes}
          </span>
        </div>
      </div>

      {/* ──── Contenido ──── */}
      <div className="p-3 h-44 flex flex-col justify-between">
        <div>
          {" "}
          <h2
            className="font-medium text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer select-none mb-1 line-clamp-2"
            onClick={() =>
              inmueble?.id && navigate(`/inmueble/${inmueble.id}`)
            }
          >
            {titulo}
          </h2>
          <div className="flex items-center gap-2 text-black">
            <p className="text-xl font-bold">
              {formatPrecioCompleto(inmueble.precio)}
            </p>
            {inmueble.operacion === "alquiler" && (
              <p className="text-xs text-gray-500">/mes</p>
            )}
          </div>
          {(inmueble.habitaciones || inmueble.area_m2) && (
            <p className="text-xs text-gray-700 mt-1">
              {inmueble.habitaciones ? `${inmueble.habitaciones} hab. ` : ""}
              {inmueble.area_m2 ? `${inmueble.area_m2} m²` : ""}
            </p>
          )}
          {ubicacion && (
            <p className="text-xs text-gray-500 mt-1">
              {ubicacion}
              {tipoLabel ? ` — ${tipoLabel}` : ""}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs mt-2">
            {operacionLabel && (
              <div className="bg-amber-100 px-2 py-0.5 rounded-sm">
                {operacionLabel}
              </div>
            )}
            {tipoLabel && (
              <div className="bg-amber-100 px-2 py-0.5 rounded-sm">
                {tipoLabel}
              </div>
            )}
          </div>
        </div>

        {/* ──── Acciones ──── */}
        <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-gray-100">
          <div
            className="flex items-center gap-1.5 text-blue-600 cursor-pointer select-none"
            onClick={() =>
              inmueble?.id && navigate(`/inmueble/${inmueble.id}`)
            }
          >
            <PiChats className="text-base" />
            <p className="text-xs font-semibold hover:underline">Contactar</p>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 cursor-pointer select-none">
            <BsTelephone className="text-sm" />
            <p className="text-xs font-semibold hover:underline">
              Ver teléfono
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="cursor-pointer select-none">
              <HiOutlineTrash className="text-base text-blue-600" />
            </div>
            <div
              className="cursor-pointer select-none"
              onClick={(e) => handleFavorito(e, inmueble?.id)}
            >
              {isFavorited ? (
                <TiHeartFullOutline className="text-base text-tercero" />
              ) : (
                <TiHeartOutline className="text-base text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
