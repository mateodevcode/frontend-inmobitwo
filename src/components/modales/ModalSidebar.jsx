import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar.jsx";

const ModalSidebar = () => {
  const { openModalSidebar, setOpenModalSidebar } = useAppContext();

  useEffect(() => {
    if (openModalSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalSidebar]);

  return (
    <AnimatePresence>
      {openModalSidebar && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-end bg-black/30 font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpenModalSidebar(false)}
        >
          <motion.div
            className="w-full h-svh flex flex-col overflow-hidden"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="absolute bg-white w-60 rounded-md border border-black/30"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModalSidebar(false);
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Sidebar />
              </div>
            </div>

            {/* Contenido scrolleable */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalSidebar;
