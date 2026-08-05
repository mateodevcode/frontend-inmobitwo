import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import usePropiedades from "@/hooks/usePropiedades";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { MdLogout, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { items_menu } from "@/data/items_menu";
import { irArriba } from "@/utils/irArriba";

const ConLogin = ({ tamano = "lg" }) => {
  const { setOpenModalHamburguesa, openModalHamburguesa, usuario } =
    useAppContext();
  const { cargarCountMisAnuncios } = usePropiedades();
  const navigate = useNavigate();

  const { handleCerrarSesion } = useAuth();
  const [countMisAnuncios, setCountMisAnuncios] = useState(0);

  const TAMANOS = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const { name } = usuario || {};
  const color = usuario ? getColorForOrg(usuario.id, name) : null;
  const sizeClass = TAMANOS[tamano] || TAMANOS.md;

  useEffect(() => {
    if (!openModalHamburguesa || !usuario?.id) return;
    (async () => {
      const count = await cargarCountMisAnuncios();
      setCountMisAnuncios(count);
    })();
  }, [openModalHamburguesa, usuario?.id, cargarCountMisAnuncios]);

  const avatar = usuario?.image_url ? (
    <img
      src={usuario.image_url}
      alt={name}
      className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm shrink-0`}
    />
  ) : (
    <div
      className={`${sizeClass} p-4 rounded-full font-semibold flex items-center justify-center hover:shadow shadow-black/10 active:scale-95 duration-75 transition shrink-0`}
      style={color}
    >
      {getInitials(name)}
    </div>
  );

  return (
    <>
      <div
        className="flex gap-2 items-center mb-4 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none"
        onClick={() => {
          setOpenModalHamburguesa(false);
          navigate("/usuario/tus-datos/perfil");
        }}
      >
        {avatar}
        <div className="flex flex-col">
          <p className="font-semibold text-black text-sm">
            {formatFirstTwoNames(name)}
          </p>
          <div className="flex items-center gap-2 -mt-1">
            <p className="text-sm">Ir a tu cuenta</p>
            <MdOutlineKeyboardArrowRight className="text-lg" />
          </div>
        </div>
      </div>

      <div>
        {items_menu.map((item, i) => {
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
              onClick={() => {
                setOpenModalHamburguesa(false);
                navigate(`/usuario/${item.id}`);
                irArriba();
              }}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="text-base">{item.label}</span>
              </div>
              <div className="text-base">
                {item.id === "mis-anuncios" && `(${countMisAnuncios})`}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center gap-2 p-4 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm mt-4"
        onClick={() => {
          setOpenModalHamburguesa(false);
          handleCerrarSesion();
        }}
      >
        <MdLogout className="text-xl" />
        <span className="text-base">Cerrar sesión</span>
      </div>
    </>
  );
};

export default ConLogin;
