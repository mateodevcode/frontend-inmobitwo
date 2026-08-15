import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import Informacion from "@/pages/publicar-anuncio/informacion/Informacion";

const ModalInformativo = () => {
  const { openModalInformativo, setOpenModalInformativo } = useAppContext();

  useEffect(() => {
    if (openModalInformativo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalInformativo]);

  return (
    <AnimatePresence>
      {openModalInformativo && (
        <motion.div
          className="fixed inset-0 z-40 bg-segundo/30 font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpenModalInformativo(false)}
        >
          <motion.div
            className="fixed right-0 bottom-0 w-full h-dvh flex flex-col overflow-hidden bg-white"
            initial={{ x: 400, y: 400, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ x: 400, y: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="cursor-pointer"
              onClick={() => setOpenModalInformativo(false)}
            >
              <div className="min-h-dvh">
                <Informacion />
              </div>
            </div>

            {/* Contenido scrolleable */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalInformativo;
