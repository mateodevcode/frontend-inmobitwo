import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { IoArrowRedoOutline, IoClose } from "react-icons/io5";
import { ImImage } from "react-icons/im";
import { FaArchway, FaMapMarkerAlt } from "react-icons/fa";
import { Md3dRotation } from "react-icons/md";
import useFavoritos from "@/hooks/useFavoritos";
import { useAppContext } from "@/context/AppContext";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import usePropiedades from "../../hooks/usePropiedades";

export default function FotoVisor() {
  const { id, fotoIndex } = useParams();
  const navigate = useNavigate();
  const { favoritos, propiedad: inmueble } = useAppContext();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();

  //   const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cargarPropiedad } = usePropiedades();

  //   useEffect(() => {
  //     if (id) {
  //       cargarPropiedad(id);
  //     }
  //   }, [id]);

  useEffect(() => {
    if (id) {
      cargarPropiedad(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  if (!inmueble) return null;

  const imagenes = [
    inmueble.imagen_principal_url,
    ...(inmueble.galeria || [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
  ].filter(Boolean);

  const totalImagenes = imagenes.length;
  const indexActual = Math.min(
    Math.max(parseInt(fotoIndex, 10) - 1, 0),
    totalImagenes - 1,
  );
  const nombreEspacio =
    inmueble.galeria?.[indexActual - 1]?.etiqueta ||
    (indexActual === 0 ? "Salón" : "");

  const isFavorited = estaEnFavoritos(favoritos, inmueble.id);

  const specsLinea = [
    inmueble.area_m2 ? `${inmueble.area_m2} m²` : null,
    inmueble.habitaciones ? `${inmueble.habitaciones} hab.` : null,
    inmueble.planta
      ? `${inmueble.planta} planta ${inmueble.exterior ? "exterior" : "interior"}${inmueble.ascensor ? " con ascensor" : ""}`
      : null,
  ].filter(Boolean);

  const irAFoto = (nuevoIndex) => {
    const clamped =
      ((nuevoIndex % totalImagenes) + totalImagenes) % totalImagenes;
    navigate(`/inmueble/${id}/foto/${clamped + 1}`, { replace: true });
  };

  const cerrar = () => navigate(`/inmueble/${id}`);

  // Navegación con teclado (flechas y Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") irAFoto(indexActual + 1);
      if (e.key === "ArrowLeft") irAFoto(indexActual - 1);
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexActual, totalImagenes]);

  return (
    <div className="fixed inset-0 z-[2000] bg-white flex flex-col font-poppins">
      {/* ──── Header ──── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
        <div className="min-w-0">
          <h1 className="font-bold text-gray-900 truncate">
            {inmueble.titulo}
          </h1>
          <p className="text-sm text-gray-700 flex items-center gap-2 flex-wrap">
            <span>{formatPrecioCompleto(inmueble.precio)}</span>
            {specsLinea.map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-px h-3 bg-gray-300" />
                {s}
              </span>
            ))}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 ml-4">
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
            <IoArrowRedoOutline className="text-lg" />
            Compartir
          </button>
          <button
            onClick={(e) => handleFavorito(e, inmueble.id)}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
          >
            {isFavorited ? (
              <TiHeartFullOutline className="text-lg text-[#e6007a]" />
            ) : (
              <TiHeartOutline className="text-lg" />
            )}
            Guardar favorito
          </button>
          <button className="bg-[#e6007a] text-white text-sm font-bold rounded-sm px-5 py-2 hover:bg-[#c40068] transition-colors">
            Contactar
          </button>
          <button
            onClick={cerrar}
            className="text-gray-700 hover:text-black"
            title="Cerrar"
          >
            <IoClose className="text-3xl" />
          </button>
        </div>
      </div>

      {/* ──── Imagen principal ──── */}
      <div className="relative flex-1 bg-black flex items-center justify-center min-h-0">
        <img
          src={imagenes[indexActual]}
          alt={nombreEspacio || inmueble.titulo}
          className="max-w-full max-h-full object-contain select-none"
        />

        {totalImagenes > 1 && (
          <>
            <button
              onClick={() => irAFoto(indexActual - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-2xl shadow-lg"
              title="Anterior"
            >
              <MdOutlineKeyboardArrowLeft />
            </button>
            <button
              onClick={() => irAFoto(indexActual + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-2xl shadow-lg"
              title="Siguiente"
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </>
        )}
      </div>

      {/* ──── Footer ──── */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 shrink-0">
        <div>
          {nombreEspacio && (
            <p className="text-sm font-semibold text-gray-900">
              {nombreEspacio}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {indexActual + 1}/{totalImagenes}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={cerrar}
            className="flex items-center gap-1.5 border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-semibold text-[#e6007a] border-[#e6007a] bg-[#e6007a]/5"
          >
            <ImImage className="text-base" />
            {totalImagenes} fotos
          </button>
          <button className="flex items-center gap-1.5 border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <FaArchway className="text-sm" />
            Plano
          </button>
          <button className="flex items-center gap-1.5 border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Md3dRotation className="text-base" />
            Visita 3D
          </button>
          <button className="flex items-center gap-1.5 border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <FaMapMarkerAlt className="text-sm" />
            Mapa
          </button>
        </div>

        <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
          <HiOutlineArrowsExpand className="text-base" />
          Ampliar foto
        </button>
      </div>
    </div>
  );
}
