import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { MdLogout } from "react-icons/md";
import useAuth from "@/hooks/useAuth";
import { logo } from "@/data/logo";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { items_menu } from "@/data/items_menu";
import { irArriba } from "@/utils/irArriba";

const ModalHamburguesa = () => {
  const {
    openModalHamburguesa,
    setOpenModalHamburguesa,
    usuario,
    propiedades,
  } = useAppContext();
  const { name } = usuario;
  const { handleCerrarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (openModalHamburguesa) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalHamburguesa]);

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
                <div className="flex gap-2 items-center p-2 border-b border-b-black/10 mb-1 justify-between">
                  <div className="px-6 py-5 md:px-10 flex items-center gap-4">
                    <div className="border-black/10 border rounded-xl w-10 h-10 flex items-center justify-center shadow-xl">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        width={25}
                        height={25}
                      />
                    </div>
                    <span className="font-montserrat text-2xl font-bold tracking-tight text-black md:text-3xl">
                      inmobitwo
                    </span>
                  </div>

                  <button
                    className="m-4 hover:rotate-180 transition duration-300 cursor-pointer select-none text-black hover:bg-stone-100 rounded-full p-2"
                    onClick={() => setOpenModalHamburguesa(false)}
                  >
                    <IoCloseOutline className="text-3xl" />
                  </button>
                </div>
                {/* Nav */}
                <div className="border border-black/10 rounded-md m-4 p-4">
                  <div
                    className="flex gap-4 items-center mb-4 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none"
                    onClick={() => navigate("/usuario/tus-datos/perfil")}
                  >
                    <div className="w-14 h-14 text-2xl text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center">
                      {getInitials(name)}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-black text-2xl">
                        {formatFirstTwoNames(name)}
                      </p>
                      <div className="flex items-center gap-2 -mt-1">
                        <p className="text-lg">Ir a tu cuenta</p>
                        <MdOutlineKeyboardArrowRight className="text-2xl" />
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
                            <span className="text-lg">{item.label}</span>
                          </div>
                          <div className="text-xl">
                            {item.id === "mis-anuncios" &&
                              `(${propiedades?.length})`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* cerrar sesion */}
                  <div
                    className="flex items-center gap-2 p-4 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm mt-4"
                    onClick={() => {
                      setOpenModalHamburguesa(false);
                      handleCerrarSesion();
                    }}
                  >
                    <MdLogout className="text-2xl" />
                    <span className="text-lg">Cerrar sesión</span>
                  </div>
                </div>
                {/* <div className="bg-black/10 w-full h-px my-1" /> */}
              </div>
            </div>

            {/* Contenido scrolleable */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalHamburguesa;
