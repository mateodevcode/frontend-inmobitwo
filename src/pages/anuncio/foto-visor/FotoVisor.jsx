import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { IoArrowRedoOutline, IoClose } from "react-icons/io5";
import { ImImage } from "react-icons/im";
import { FaArchway, FaMapMarkerAlt } from "react-icons/fa";
import { Md3dRotation, MdMyLocation } from "react-icons/md";
import useFavoritos from "@/hooks/useFavoritos";
import { useAppContext } from "@/context/AppContext";
import { useFavoritosStore } from "@/hooks/favoritosStore";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import { agruparPorOrden } from "@/utils/galeriaUtils";
import PropertyImage from "@/components/common/PropertyImage";
import usePropiedades from "../../../hooks/usePropiedades";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import * as maplibregl from "maplibre-gl";
import { ZoomControl } from "@/pages/seleccionar-zona/components/MapControls";

export default function FotoVisor() {
  const { id, fotoIndex } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { propiedad: inmueble } = useAppContext();
  const favoritos = useFavoritosStore();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();

  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [modo, setModo] = useState(
    searchParams.get("mapa") === "1"
      ? "mapa"
      : searchParams.get("planos") === "1"
        ? "planos"
        : "fotos",
  );
  const mapaContainerRef = useRef(null);
  const mapaInstanceRef = useRef(null);
  const [mapa, setMapa] = useState(null);
  const { cargarPropiedad } = usePropiedades();

  useEffect(() => {
    if (id) {
      cargarPropiedad(id);
    }
  }, [id]);

  // ──── Mapa ────
  useEffect(() => {
    if (modo !== "mapa" || !inmueble?.latitude || !inmueble?.longitude) return;
    if (mapaInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapaContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
      },
      center: [inmueble.longitude, inmueble.latitude],
      zoom: 16,
      attributionControl: false,
    });

    const el = document.createElement("div");
    el.innerHTML = `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.6 12.5 27 12.5 27s12.5-18.4 12.5-27C25 5.6 19.4 0 12.5 0z" fill="#FF1B1C"/><circle cx="12.5" cy="12.5" r="5" fill="white"/></svg>`;
    new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([inmueble.longitude, inmueble.latitude])
      .addTo(map);

    mapaInstanceRef.current = map;
    setMapa(map);

    return () => {
      map.remove();
      mapaInstanceRef.current = null;
      setMapa(null);
    };
  }, [modo, inmueble?.latitude, inmueble?.longitude]);

  const handleCentrarMapa = () => {
    const map = mapaInstanceRef.current;
    if (map && inmueble?.latitude && inmueble?.longitude) {
      map.flyTo({
        center: [inmueble.longitude, inmueble.latitude],
        zoom: 16,
        duration: 800,
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-2000 bg-black flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  if (!inmueble) return null;

  // Una "foto" = filas con el mismo orden (5 tamaños). La portada (orden -1)
  // ya viene dentro de galeria y queda primera. Agrupar evita "saltar" entre
  // tamaños de la misma foto al navegar.
  const fotosAgrupadas = agruparPorOrden(inmueble.galeria);
  const planosAgrupados = agruparPorOrden(inmueble.planos);

  const totalImagenes = fotosAgrupadas.length;
  const totalPlanos = planosAgrupados.length;

  const modosDisponibles = [
    ...(totalImagenes > 0 ? ["fotos"] : []),
    ...(totalPlanos > 0 ? ["planos"] : []),
    ...(inmueble?.video_3d ? ["3d"] : []),
    ...(inmueble?.latitude && inmueble?.longitude ? ["mapa"] : []),
  ];
  const indexActual = Math.min(
    Math.max(parseInt(fotoIndex, 10) - 1, 0),
    totalImagenes - 1,
  );
  const nombreEspacio =
    inmueble.galeria?.[indexActual - 1]?.etiqueta ||
    (indexActual === 0 ? "Salón" : "");

  const isFavorited = estaEnFavoritos(favoritos, inmueble.id);

  const specsLinea = [
    inmueble.constructed_area
      ? `${inmueble.constructed_area} m²`
      : inmueble.private_area
        ? `${inmueble.private_area} m²`
        : null,
    inmueble.bedroom_count != null ? `${inmueble.bedroom_count} alc.` : null,
    inmueble.floor
      ? `${inmueble.floor} ${inmueble.has_elevator ? "con ascensor" : ""}`
      : null,
    inmueble.estrato != null ? `Estrato ${inmueble.estrato}` : null,
  ].filter(Boolean);

  const handleNavegar = (direccion) => {
    if (modo === "fotos") {
      const nuevo = indexActual + direccion;
      if (nuevo >= 0 && nuevo < totalImagenes) {
        navigate(`/inmueble/${id}/foto/${nuevo + 1}`, { replace: true });
        return;
      }
    }
    if (modo === "planos" && totalPlanos > 0) {
      const nuevo = indexActual + direccion;
      if (nuevo >= 0 && nuevo < totalPlanos) {
        navigate(`/inmueble/${id}/foto/${nuevo + 1}`, { replace: true });
        return;
      }
    }
    // saltar al siguiente/anterior modo disponible (solo secciones que existen)
    if (modosDisponibles.length === 0) return;
    const idx = modosDisponibles.indexOf(modo);
    const nuevoModoIdx =
      (((idx + direccion) % modosDisponibles.length) +
        modosDisponibles.length) %
      modosDisponibles.length;
    const nuevoModo = modosDisponibles[nuevoModoIdx];
    setModo(nuevoModo);
    if (nuevoModo === "fotos") {
      const target = direccion > 0 ? 0 : totalImagenes - 1;
      navigate(`/inmueble/${id}/foto/${target + 1}`, { replace: true });
    }
    if (nuevoModo === "planos" && totalPlanos > 0) {
      const target = direccion > 0 ? 0 : totalPlanos - 1;
      navigate(`/inmueble/${id}/foto/${target + 1}`, { replace: true });
    }
  };

  const cerrar = () => navigate(-1);

  // Navegacion con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreen) {
        if (e.key === "Escape" || e.key === "F11") {
          e.preventDefault();
          setFullscreen(false);
          return;
        }
        if (e.key === "ArrowRight") handleNavegar(1);
        if (e.key === "ArrowLeft") handleNavegar(-1);
        return;
      }
      if (e.key === "ArrowRight") handleNavegar(1);
      if (e.key === "ArrowLeft") handleNavegar(-1);
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexActual, totalImagenes, fullscreen, modo]);

  const counterText = (() => {
    switch (modo) {
      case "fotos":
        return `Foto ${indexActual + 1}/${totalImagenes}`;
      case "planos":
        return totalPlanos > 0
          ? `Plano ${indexActual + 1}/${totalPlanos}`
          : "Plano no disponible";
      case "mapa":
        return "Mapa de zona";
      case "plano":
        return "Plano";
      case "3d":
        return "Vista 3D";
      default:
        return "";
    }
  })();

  const btnClass = (m) =>
    `flex items-center gap-2 border-2 px-3 py-1.5 text-sm font-semibold cursor-pointer justify-center ${
      modo === m
        ? "border-tercero text-tercero bg-tercero/20"
        : "border-black/80 text-gray-800 hover:border-tercero hover:text-tercero hover:bg-tercero/20"
    }`;

  return (
    <div className="fixed inset-0 z-2000 bg-white flex flex-col font-poppins">
      {/* ──── Header ──── */}
      {!fullscreen && (
        <div className="w-full mx-auto border-b border-gray-200 flex items-center justify-center relative font-poppins">
          <div className="flex items-center justify-between px-4 py-3 w-full md:w-8/12">
            <div className="min-w-0">
              <h1 className="font-semibold text-black truncate">
                {inmueble.titulo}
              </h1>
              <p className="text-sm text-black/70 font-semibold flex items-center gap-2 flex-wrap">
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
                  <TiHeartFullOutline className="text-lg text-tercero" />
                ) : (
                  <TiHeartOutline className="text-lg" />
                )}
                Guardar favorito
              </button>
              {/* <button className="bg-[#e6007a] text-white text-sm font-semibold rounded-sm px-5 py-2 hover:bg-[#c40068] transition-colors"> */}
              <button
                className="bg-tercero text-white text-sm font-semibold rounded-sm px-5 py-2 hover:bg-tercero/80 transition-colors border-2 border-black cursor-pointer select-none"
                type="button"
                onClick={() => alert("Contactar")}
              >
                Contactar
              </button>
              <button
                onClick={cerrar}
                className="text-black/60 hover:text-black absolute right-4 hidden md:flex cursor-pointer select-none"
                title="Cerrar"
              >
                <IoClose className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Contenido principal ──── */}
      <div
        className={`relative flex-1 flex items-center justify-center min-h-0 ${fullscreen ? "fixed inset-0 z-2100 bg-black" : ""}`}
      >
        <button
          type="button"
          onClick={cerrar}
          className="absolute top-3 left-4 bg-white border-2 border-black rounded-sm px-4 py-2.5 text-sm font-semibold shadow hover:bg-gray-100 z-10 md:hidden flex items-center gap-1 text-black"
        >
          <MdKeyboardArrowLeft className="text-lg" />
          Volver
        </button>
        {modo === "mapa" && inmueble?.latitude && inmueble?.longitude ? (
          <div className="w-full h-full relative">
            <div ref={mapaContainerRef} className="w-full h-full" />
            {mapa && (
              <div className="absolute bottom-4 right-4 z-10">
                <ZoomControl map={mapa} />
              </div>
            )}
            <button
              onClick={handleCentrarMapa}
              className="absolute top-3 md:right-12 right-4 bg-white border-2 border-black rounded-sm px-5 py-2.5 text-sm font-semibold shadow hover:bg-gray-100 z-10 flex items-center gap-1 text-black"
            >
              <MdMyLocation className="text-sm" />
              Centrar
            </button>
            {fullscreen && (
              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 left-4 z-2200 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-lg p-3 transition-colors duration-200 cursor-pointer"
                title="Salir de pantalla completa"
              >
                <BsArrowsAngleContract className="text-2xl" />
              </button>
            )}
          </div>
        ) : modo === "plano" ? (
          <div className="flex items-center justify-center text-gray-400 text-lg">
            Plano no disponible
          </div>
        ) : modo === "planos" && totalPlanos > 0 ? (
          <PropertyImage
            foto={planosAgrupados[indexActual]}
            tamañoBase="xlarge"
            sizes="200vw"
            alt={`Plano ${indexActual + 1}`}
            className={`${fullscreen ? "w-full h-full" : "max-w-full max-h-full"} object-contain select-none`}
          />
        ) : modo === "3d" ? (
          <div className="flex items-center justify-center text-gray-400 text-lg">
            Vista 3D no disponible
          </div>
        ) : (
          <>
            <PropertyImage
              foto={fotosAgrupadas[indexActual]}
              tamañoBase="xlarge"
              sizes="200vw"
              alt={nombreEspacio || inmueble.titulo}
              className={`${fullscreen ? "w-full h-full" : "max-w-full max-h-full"} object-contain select-none`}
            />

            {fullscreen && (
              <button
                onClick={() => setFullscreen(false)}
                className="absolute bottom-4 right-4 z-2200 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-lg p-3 transition-colors duration-200 cursor-pointer"
                title="Salir de pantalla completa"
              >
                <BsArrowsAngleContract className="text-2xl" />
              </button>
            )}

            {/* Flechas de navegacion entre modos (siempre visibles) */}
            <button
              onClick={() => handleNavegar(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white transition duration-300 flex items-center justify-center text-xl shadow-lg border border-black/20 z-10"
              title="Anterior"
            >
              <MdOutlineKeyboardArrowLeft className="text-2xl text-black" />
            </button>
            <button
              onClick={() => handleNavegar(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white transition duration-300 flex items-center justify-center text-xl shadow-lg border border-black/20 z-10"
              title="Siguiente"
            >
              <MdOutlineKeyboardArrowRight className="text-2xl text-black" />
            </button>
          </>
        )}
      </div>

      {/* ──── Footer ──── */}
      {!fullscreen && (
        <div className="flex items-center justify-center border-t border-gray-200 mx-auto w-full">
          <div className="flex items-center md:flex-row flex-col justify-between md:px-6 px-0 py-3 w-full md:w-8/12 gap-4">
            <div className="md:w-30">
              <p className="text-xs text-gray-500">{counterText}</p>
            </div>

            <div className="gap-0.5 md:gap-0 items-center flex-wrap grid grid-cols-3 md:grid-cols-4">
              {totalImagenes > 0 && (
                <button
                  onClick={() => setModo("fotos")}
                  className={btnClass("fotos")}
                >
                  <ImImage className="text-base" />
                  {totalImagenes} fotos
                </button>
              )}
              {totalPlanos > 0 && (
                <button
                  onClick={() => setModo("planos")}
                  className={btnClass("planos")}
                >
                  <FaArchway className="text-sm" />
                  {totalPlanos} planos
                </button>
              )}
              {inmueble?.video_3d && (
                <button
                  onClick={() => setModo("3d")}
                  className={btnClass("3d")}
                >
                  <Md3dRotation className="text-base" />
                  Visita 3D
                </button>
              )}
              {inmueble?.latitude && inmueble?.longitude && (
                <button
                  onClick={() => setModo(modo === "mapa" ? "fotos" : "mapa")}
                  className={btnClass("mapa")}
                >
                  <FaMapMarkerAlt className="text-sm" />
                  Mapa
                </button>
              )}
            </div>

            <button
              onClick={() => setFullscreen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline cursor-pointer md:w-36"
            >
              <BsArrowsAngleExpand className="text-base" />
              {modo === "planos" ? "Ampliar plano" : "Ampliar foto"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
