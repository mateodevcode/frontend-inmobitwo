import { useCallback, useEffect, useRef, useState } from "react";
import { BsFillGeoAltFill } from "react-icons/bs";
import { FaArchway } from "react-icons/fa6";
import { FiVideo } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi2";
import { ImImage } from "react-icons/im";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { PiChats } from "react-icons/pi";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useFavoritosStore } from "@/hooks/favoritosStore";
import useFavoritos from "@/hooks/useFavoritos";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import { agruparPorOrden } from "@/utils/galeriaUtils";
import PropertyImage from "@/components/common/PropertyImage";

const AUTOPLAY_SECONDS = 10;

const TIPO_BADGE = {
  apartamento: "Apartamento",
  casa: "Casa",
  casa_campestre: "Casa campestre",
  apartaestudio: "Apartaestudio",
  penthouse: "Penthouse",
  casa_lote: "Casa lote",
  local: "Local",
  oficina: "Oficina",
  bodega: "Bodega",
  consultorio: "Consultorio",
  edificio: "Edificio",
  lote: "Lote / Terreno",
  finca: "Finca",
  parqueadero: "Parqueadero",
  trastero: "Trastero",
  habitacion: "Habitación",
};

const OPERACION_LABEL = {
  venta: "Venta",
  alquiler: "Alquiler",
};

const CardAnuncio = ({ propiedad, listaIds, posicion, total, filtroLabel }) => {
  const navigate = useNavigate();
  const favoritos = useFavoritosStore();
  const { estaEnFavoritos, handleFavorito } = useFavoritos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoTimerRef = useRef(null);

  const slug = (t) =>
    t
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  const operacionSlug =
    propiedad?.operacion_slug || slug(propiedad?.operacion) || "venta";
  const tipoSlug = propiedad?.tipo_slug || slug(propiedad?.tipo);

  let searchUrl = `/${operacionSlug}-${tipoSlug}`;
  if (propiedad?.city_name && propiedad?.state_name) {
    searchUrl += `/${slug(propiedad.city_name)}-${slug(propiedad.state_name)}`;
  }

  const navState = { listaIds, posicion, total, filtroLabel, searchUrl };

  const titulo =
    propiedad?.titulo || "Inmueble en venta";
  const ubicacion = propiedad?.city_name
    ? `${propiedad.city_name}, ${propiedad.state_name}`
    : "Colombia";
  const tipoLabel =
    propiedad?.tipo_inmueble || TIPO_BADGE[propiedad?.tipo] || propiedad?.tipo || "Inmueble";
  const operacionLabel =
    propiedad?.operacion || OPERACION_LABEL[propiedad?.operacion] || "Venta";

  const galeria = propiedad?.galeria || [];
  const planos = propiedad?.planos || [];

  // Una "foto" = filas con el mismo orden (5 tamaños). La portada (orden -1)
  // ya viene dentro de galeria y queda primera.
  const fotos = [
    ...agruparPorOrden(galeria),
    ...agruparPorOrden(planos),
  ].filter((f) => f.tamaños && Object.keys(f.tamaños).length > 0);

  const totalImagenes = fotos.length;
  const isFavorited = estaEnFavoritos(favoritos, propiedad?.id);

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
  }, [currentIndex]); // eslint-disable-line

  return (
    <div
      className="flex items-center md:flex-row flex-col md:h-64 h-130 w-full rounded-md shadow-lg hover:shadow-xl shadow-black/10 transition duration-300 group cursor-pointer"
      onClick={() =>
        propiedad?.id &&
        navigate(`/inmueble/${propiedad.id}`, { state: navState })
      }
    >
      <div className="w-full md:w-[35%] h-full bg-primero rounded-l-md relative overflow-hidden">
        <PropertyImage
          foto={fotos[currentIndex]}
          tamañoBase="medium"
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 35vw"
          alt={titulo}
          className="w-full h-full object-cover rounded-l-md"
        />

        <div className="absolute left-2 bottom-2 flex items-center justify-center gap-2 z-10">
          <div
            className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              propiedad?.id &&
                navigate(`/inmueble/${propiedad.id}`, {
                  state: { ...navState, abrirFotoVisor: "fotos" },
                });
            }}
            title="Ver fotos"
          >
            <ImImage className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
          {planos.length > 0 && (
            <div
              className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                propiedad?.id &&
                  navigate(`/inmueble/${propiedad.id}`, {
                    state: { ...navState, abrirFotoVisor: "planos" },
                  });
              }}
              title="Ver planos"
            >
              <FaArchway className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
            </div>
          )}
          <div
            className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              propiedad?.id &&
                navigate(`/inmueble/${propiedad.id}`, {
                  state: { ...navState, abrirFotoVisor: "3d" },
                });
            }}
            title="Visita 3D"
          >
            <FiVideo className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
          <div
            className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              propiedad?.id &&
                navigate(`/inmueble/${propiedad.id}`, {
                  state: { ...navState, abrirFotoVisor: "mapa" },
                });
            }}
            title="Ver mapa"
          >
            <BsFillGeoAltFill className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
        </div>

        {totalImagenes > 1 && (
          <>
            <div
              className="absolute left-1 top-1/2 -translate-y-1/2 hover:bg-primero/80 rounded-full p-1.5 hover:text-black text-primero transition duration-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex - 1);
              }}
            >
              <MdOutlineKeyboardArrowLeft className="text-3xl shadow-2xl shadow-black" />
            </div>
            <div
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-primero/80 rounded-full p-1.5 hover:text-black text-primero transition duration-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex + 1);
              }}
            >
              <MdOutlineKeyboardArrowRight className="text-3xl shadow-2xl shadow-black" />
            </div>
          </>
        )}

        <div className="bg-black/70 absolute bottom-2 right-2 p-1.5 px-2 rounded-md">
          <span className="text-white/80 font-semibold text-sm">
            {currentIndex + 1}/{totalImagenes}
          </span>
        </div>
      </div>

      <div className="w-full md:w-[65%] bg-primero h-full rounded-r-md relative pb-3 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <h2
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer select-none px-4 pt-2"
              onClick={(e) => {
                e.stopPropagation();
                propiedad?.id &&
                  navigate(`/inmueble/${propiedad.id}`, { state: navState });
              }}
            >
              {titulo}
            </h2>
            {propiedad?.es_de_organizacion && (
              <div className="mx-6 border border-segundo/10 w-32 h-16">
                <img
                  src={propiedad?.organizacion_logo_url || "/logo/logo-hor.png"}
                  alt={propiedad?.organizacion_nombre || "Inmobiliaria"}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="px-4">
            <div className="flex items-center gap-2 text-black">
              <p className="text-2xl font-bold">
                {formatPrecioCompleto(propiedad.precio)}
              </p>
              {propiedad.operacion === "alquiler" && (
                <p className="text-sm text-gray-500">/mes</p>
              )}
            </div>

            <div className="text-sm flex items-center gap-2">
              <p>
                {propiedad?.bedroom_count != null && (
                  <span>{propiedad.bedroom_count} alc. </span>
                )}
                {propiedad?.private_area != null && (
                  <span>{propiedad.private_area} m² </span>
                )}
                {propiedad?.constructed_area != null && (
                  <span>construidos: {propiedad.constructed_area} m²</span>
                )}
                {propiedad?.bedroom_count == null &&
                  propiedad?.private_area == null &&
                  propiedad?.constructed_area == null && (
                    <span>Inmueble en Colombia</span>
                  )}
              </p>
              {propiedad?.price_per_sqm != null && (
                <p className="text-red-600">
                  {formatPrecioCompleto(propiedad.price_per_sqm)}/m²
                </p>
              )}
            </div>

            <div className="text-sm mt-2">
              {ubicacion} — {tipoLabel} en {operacionLabel}
            </div>

            <div className="flex items-center gap-2 text-xs mt-2">
              <div className="bg-amber-100 px-2 py-0.5">{operacionLabel}</div>
              <div className="bg-amber-100 px-2 py-0.5">{tipoLabel}</div>
              {propiedad?.estrato != null && (
                <div className="bg-amber-100 px-2 py-0.5">
                  Estrato {propiedad.estrato}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 flex items-center justify-between w-full">
          <div
            className="flex items-center gap-2 text-blue-600 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              propiedad?.id &&
                navigate(`/inmueble/${propiedad.id}`, { state: navState });
            }}
          >
            <PiChats className="text-lg" />
            <p className="text-sm font-semibold hover:underline">Contactar</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="cursor-pointer select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <HiOutlineTrash className="text-lg text-blue-600" />
            </div>
            <div
              className="cursor-pointer select-none"
              onClick={(e) => handleFavorito(e, propiedad?.id)}
            >
              {isFavorited ? (
                <TiHeartFullOutline className="text-lg text-tercero" />
              ) : (
                <TiHeartOutline className="text-lg text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAnuncio;
