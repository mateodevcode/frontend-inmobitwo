import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Logo from "../../logo/Logo";
import SinLogin from "./SinLogin";
import ConLogin from "./ConLogin";
import EnlacesHamburguesa from "./EnlacesHamburguesa";
import DescargarApp from "./DescargarApp";

const ModalHamburguesa = () => {
  const { openModalHamburguesa, setOpenModalHamburguesa, usuario } =
    useAppContext();

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
            className="w-full h-svh flex flex-col bg-white"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fijo */}
            <div className="flex items-center w-11/12 justify-between mx-auto py-5 shrink-0 border-b border-gray-200">
              <div>
                <Logo />
              </div>

              <button
                className="hover:rotate-180 transition duration-300 cursor-pointer select-none text-black hover:bg-stone-100 rounded-full p-2"
                onClick={() => setOpenModalHamburguesa(false)}
              >
                <IoCloseOutline className="text-3xl" />
              </button>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Nav */}
              <div className="border border-black/10 rounded-md m-4 p-4">
                {usuario ? <ConLogin /> : <SinLogin />}
              </div>

              <EnlacesHamburguesa />
            </div>

            {/* Footer - Fijo */}
            <div className="shrink-0 border-t border-gray-200">
              <DescargarApp />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalHamburguesa;
