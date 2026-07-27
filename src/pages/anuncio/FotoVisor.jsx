import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { IoArrowRedoOutline, IoClose } from "react-icons/io5";
import { ImImage } from "react-icons/im";
import { FaArchway, FaMapMarkerAlt } from "react-icons/fa";
import { Md3dRotation } from "react-icons/md";
import useFavoritos from "@/hooks/useFavoritos";
import { useAppContext } from "@/context/AppContext";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import usePropiedades from "../../hooks/usePropiedades";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";

export default function FotoVisor() {
  const { id, fotoIndex } = useParams();
  const navigate = useNavigate();
  const { favoritos, propiedad: inmueble } = useAppContext();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();

  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { cargarPropiedad } = usePropiedades();

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
      if (fullscreen) {
        if (e.key === "Escape" || e.key === "F11") {
          e.preventDefault();
          setFullscreen(false);
          return;
        }
        if (e.key === "ArrowRight") irAFoto(indexActual + 1);
        if (e.key === "ArrowLeft") irAFoto(indexActual - 1);
        return;
      }
      if (e.key === "ArrowRight") irAFoto(indexActual + 1);
      if (e.key === "ArrowLeft") irAFoto(indexActual - 1);
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexActual, totalImagenes, fullscreen]);

  return (
    <div className="fixed inset-0 z-2000 bg-white flex flex-col font-poppins">
      {/* ──── Header ──── */}
      {!fullscreen && (
      <div className="w-full mx-auto border-b border-gray-200 flex items-center justify-center relative">
        <div className="flex items-center justify-between px-6 py-3 w-8/12">
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
              className="text-gray-700 hover:text-black absolute right-4"
              title="Cerrar"
            >
              <IoClose className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ──── Imagen principal ──── */}
      <div className={`relative flex-1 flex items-center justify-center min-h-0 ${fullscreen ? "fixed inset-0 z-[2100] bg-black" : ""}`}>
        <img
          src={imagenes[indexActual]}
          alt={nombreEspacio || inmueble.titulo}
          className={`${fullscreen ? "w-full h-full" : "max-w-full max-h-full"} object-contain select-none`}
        />

        {totalImagenes > 1 && (
          <>
            <button
              onClick={() => irAFoto(indexActual - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white hover:bg-gray-50 transition duration-300 flex items-center justify-center text-2xl shadow-lg border border-black/20"
              title="Anterior"
            >
              <MdOutlineKeyboardArrowLeft className="text-4xl text-black" />
            </button>
            <button
              onClick={() => irAFoto(indexActual + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white hover:bg-gray-50 transition duration-300 flex items-center justify-center text-2xl shadow-lg border border-black/20"
              title="Siguiente"
            >
              <MdOutlineKeyboardArrowRight className="text-4xl text-black" />
            </button>
          </>
        )}

        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute bottom-4 right-4 z-[2200] bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-lg p-3 transition-colors duration-200 cursor-pointer"
            title="Salir de pantalla completa"
          >
            <BsArrowsAngleContract className="text-2xl" />
          </button>
        )}
      </div>

      {/* ──── Footer ──── */}
      {!fullscreen && (
      <div className="flex items-center justify-center border-t border-gray-200 mx-auto w-full">
        <div className="flex items-center justify-between px-6 py-3 w-8/12">
          <div className="w-20">
            {/* {nombreEspacio && (
              <p className="text-sm font-semibold text-gray-900">
                {nombreEspacio}
              </p>
            )} */}
            <p className="text-xs text-gray-500">
              {indexActual + 1}/{totalImagenes}
            </p>
          </div>

          <div className="hidden md:flex items-center">
            <button className="flex items-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer">
              <ImImage className="text-base" />
              {totalImagenes} fotos
            </button>
            <button className="flex items-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer">
              <FaArchway className="text-sm" />
              Plano
            </button>
            <button className="flex items-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer">
              <Md3dRotation className="text-base" />
              Visita 3D
            </button>
            <button className="flex items-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-[#e6007a] hover:text-[#e6007a] hover:bg-[#e6007a]/20 cursor-pointer">
              <FaMapMarkerAlt className="text-sm" />
              Mapa
            </button>
          </div>

          <button
            onClick={() => setFullscreen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            <BsArrowsAngleExpand className="text-base" />
            Ampliar foto
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
