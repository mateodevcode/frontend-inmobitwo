import { AiOutlineEdit } from "react-icons/ai";
import { FaArchway, FaMapMarkerAlt } from "react-icons/fa";
import { GiHistogram } from "react-icons/gi";
import { GoArrowDown } from "react-icons/go";
import { ImImage } from "react-icons/im";
import { IoArrowRedoOutline } from "react-icons/io5";
import { Md3dRotation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useTracking from "@/hooks/useTracking";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import { useTiempoRelativo } from "@/hooks/useTiempoRelativo";
import BotonFavorito from "./BotonFavorito";
import BotonDescartar from "./BotonDescartar";
import useFavoritos from "../../../hooks/useFavoritos";

const CardPrincipal = ({
  inmueble,
  totalImagenes,
  totalPlanos,
  specsLinea,
}) => {
  const navigate = useNavigate();
  const { dispararEventoYRevisar } = useTracking();
  const { isFavorited, toggleFavorito } = useFavoritos(inmueble.id);
  const tiempo = useTiempoRelativo(inmueble?.created_at);

  const handleCompartirClick = () => {
    if (inmueble?.id) dispararEventoYRevisar(inmueble.id, "click_compartir");
  };

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1 mt-3">
        {totalImagenes > 0 && (
          <button
            onClick={() => navigate(`/inmueble/${inmueble.id}/foto/1`)}
            className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-tercero hover:text-tercero hover:bg-tercero/20 cursor-pointer"
          >
            <ImImage className="text-base" />
            {totalImagenes} fotos
          </button>
        )}
        {totalPlanos > 0 && (
          <button
            onClick={() => navigate(`/inmueble/${inmueble.id}/foto/1?planos=1`)}
            className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-tercero hover:text-tercero hover:bg-tercero/20 cursor-pointer"
          >
            <FaArchway /> {totalPlanos} planos
          </button>
        )}
        {inmueble?.video_3d && (
          <button
            onClick={() =>
              document
                .getElementById("tour-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-tercero hover:text-tercero hover:bg-tercero/20 cursor-pointer"
          >
            <Md3dRotation /> Vista 3D
          </button>
        )}
        {inmueble?.latitude && inmueble?.longitude && (
          <button
            onClick={() => navigate(`/inmueble/${inmueble.id}/foto/1?mapa=1`)}
            className="flex items-center justify-center gap-2 border-2 border-black/80 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-tercero hover:text-tercero hover:bg-tercero/20 cursor-pointer"
          >
            <FaMapMarkerAlt /> Mapa
          </button>
        )}
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
          <p className="text-sm text-gray-700 mt-2">{specsLinea.join(" · ")}</p>
        )}

        <div className="flex items-center gap-4 mt-4">
          <BotonFavorito isFavorited={isFavorited} onClick={toggleFavorito} />
          <BotonDescartar />
          <button
            onClick={handleCompartirClick}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <IoArrowRedoOutline className="text-lg" />
            <span className="hidden md:flex">Compartir</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CardPrincipal;
