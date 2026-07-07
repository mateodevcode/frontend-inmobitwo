// Modal pendiente de uso

import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import AgregarPropiedad from "@/components/propiedades/agregar-propiedad/AgregarPropiedad";

const ModalAgregarPropiedad = () => {
  const { openModalAgregarPropiedad, setOpenModalAgregarPropiedad } =
    useAppContext();

  useEffect(() => {
    if (openModalAgregarPropiedad) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalAgregarPropiedad]);

  return (
    <AnimatePresence>
      {openModalAgregarPropiedad && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-end bg-black/80 font-poppins backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="w-full h-svh flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center m-4 cursor-pointer select-none hover:bg-white/80 absolute"
              onClick={() =>
                setOpenModalAgregarPropiedad(!openModalAgregarPropiedad)
              }
            >
              <IoIosClose className="text-4xl text-black" />
            </button>
            <div
              className="bg-white w-[60%] h-svh mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AgregarPropiedad />
            </div>

            {/* Contenido scrolleable */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalAgregarPropiedad;
