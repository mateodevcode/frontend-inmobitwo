import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { MdLogout } from "react-icons/md";
import useAuth from "@/hooks/useAuth";
import usePropiedades from "@/hooks/usePropiedades";
import { logo } from "@/data/logo";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { items_menu } from "@/data/items_menu";
import { irArriba } from "@/utils/irArriba";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";

const ModalHamburguesa = ({ tamano = "lg" }) => {
  const {
    openModalHamburguesa,
    setOpenModalHamburguesa,
    usuario,
  } = useAppContext();
  const { handleCerrarSesion } = useAuth();
  const { cargarCountMisAnuncios } = usePropiedades();
  const navigate = useNavigate();
  const [countMisAnuncios, setCountMisAnuncios] = useState(0);

  const TAMANOS = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const { name } = usuario;
  const color = getColorForOrg(usuario.id, name);
  const sizeClass = TAMANOS[tamano] || TAMANOS.md;

  useEffect(() => {
    if (openModalHamburguesa) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalHamburguesa]);

  useEffect(() => {
    if (!openModalHamburguesa || !usuario?.id) return;
    (async () => {
      const count = await cargarCountMisAnuncios();
      setCountMisAnuncios(count);
    })();
  }, [openModalHamburguesa, usuario?.id, cargarCountMisAnuncios]);

  const avatar = usuario.image_url ? (
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
    <AnimatePresence>
      {openModalHamburguesa && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-end bg-black/30 font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpenModalHamburguesa(false)}
        >
          <motion.div
            className="w-full h-svh flex flex-col overflow-hidden"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="bg-white w-full h-svh"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-1">
                {/* Header */}
                <div className="flex items-center w-11/12 justify-between mx-auto">
                  <div
                    className="flex items-center gap-2 select-none py-5"
                    onClick={() => {
                      navigate("/");
                      irArriba();
                    }}
                  >
                    <div className="w-9 h-9">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="object-center w-full h-full"
                      />
                    </div>
                    <span className="text-2xl md:text-3xl tracking-tight text-black font-bold font-poppins">
                      inmobitwo
                    </span>
                  </div>

                  <button
                    className="hover:rotate-180 transition duration-300 cursor-pointer select-none text-black hover:bg-stone-100 rounded-full p-2"
                    onClick={() => setOpenModalHamburguesa(false)}
                  >
                    <IoCloseOutline className="text-3xl" />
                  </button>
                </div>
                {/* Nav */}
                <div className="border border-black/10 rounded-md m-4 p-4">
                  {usuario ? (
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
                                {item.id === "mis-anuncios" &&
                                  `(${countMisAnuncios})`}
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
                  ) : (
                    <div>
                      <div
                        className="flex items-center gap-4 p-4 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                        onClick={() => {
                          setOpenModalHamburguesa(false);
                          navigate("/login");
                        }}
                      >
                        <span className="text-lg">Acceder</span>
                      </div>
                      <div
                        className="flex items-center gap-4 p-4 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                        onClick={() => {
                          setOpenModalHamburguesa(false);
                          navigate("/registro");
                        }}
                      >
                        <span className="text-lg">Registrarse</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalHamburguesa;
