import { BsGeoAlt, BsTelephone } from "react-icons/bs";
import { CiShare2 } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxRulerSquare } from "react-icons/rx";
import { TbPointFilled } from "react-icons/tb";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import MenuOpciones from "@/components/principal/card-propiedad/MenuOpciones";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import { useAppContext } from "@/context/AppContext";
import { useTiempoRelativo } from "@/hooks/useTiempoRelativo";
import useTracking from "@/hooks/useTracking";
import useFavoritos from "@/hooks/useFavoritos";
import ImagenesCard from "./ImagenesCard";

const CardPropiedad = ({ propiedades, ultimaCardRef, esLaUltima }) => {
  const { id, publicador, created_at } = propiedades;

  const tiempo = useTiempoRelativo(created_at);
  const { estaEnFavoritos, handleFavorito } = useFavoritos();
  const { dispararEventoYRevisar } = useTracking();
  const navigate = useNavigate();
  const {
    setOpenModalConfirmarEliminarPropiedad,
    setPropiedadAEliminar,
    favoritos,
  } = useAppContext();

  const esOrganizacion = publicador?.tipo === "organizacion";
  // usuario -> "name" | organizacion -> "nombre"
  const nombrePublicador = esOrganizacion ? publicador.nombre : publicador.name;
  // usuario -> "image_url" | organizacion -> "logo_url"
  const imagenPublicador = esOrganizacion
    ? publicador.logo_url
    : publicador.image_url;

  const color = getColorForOrg(publicador.id, publicador.tipo || "user");
  const isFavorited = estaEnFavoritos(favoritos, id);

  const handleContactar = (e) => {
    e.stopPropagation();
    dispararEventoYRevisar(id, "click_telefono");
  };

  return (
    <div
      className="font-poppins border border-black/20 rounded-md bg-white"
      key={propiedades.id}
      ref={esLaUltima ? ultimaCardRef : null}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="flex gap-2">
          {imagenPublicador ? (
            <img
              src={imagenPublicador}
              alt={nombrePublicador}
              className={`w-10 h-10 rounded-md object-cover ${
                esOrganizacion ? "" : "rounded-full"
              }`}
            />
          ) : (
            <div
              className={`flex items-center justify-center p-2 w-10 h-10 rounded-md font-semibold uppercase`}
              style={color}
            >
              {getInitials(nombrePublicador)}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-black">
                {esOrganizacion
                  ? nombrePublicador
                  : formatFirstTwoNames(nombrePublicador)}
              </p>
              {esOrganizacion && (
                <FaRegBuilding
                  className="text-black/40 text-xs"
                  title="Inmobiliaria"
                />
              )}
            </div>
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
      <ImagenesCard propiedades={propiedades} />
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
          className={`flex items-center justify-center gap-2 border rounded-md px-2 py-1.5 font-semibold w-full cursor-pointer select-none active:scale-95 duration-75 transition text-xs md:text-base ${
            isFavorited
              ? "bg-red-50 border-red-500 text-red-600"
              : "bg-white border-black/20 text-black hover:bg-black/5"
          }`}
          type="button"
          onClick={(e) => handleFavorito(e, propiedades.id)}
        >
          {isFavorited ? (
            <TiHeartFullOutline className="text-base md:text-lg" />
          ) : (
            <TiHeartOutline className="text-base md:text-lg" />
          )}
          <span>{isFavorited ? "Favorito" : "Guardar"}</span>
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
