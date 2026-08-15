import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import ConLogin from "./modal-hamburguesa/ConLogin";
import SinLogin from "./modal-hamburguesa/SinLogin";
import DescargarApp from "./modal-hamburguesa/DescargarApp";

const ModalUser = () => {
  const { openModalUser, setOpenModalUser, usuario } = useAppContext();

  if (!usuario) return null;

  return (
    <AnimatePresence>
      {openModalUser && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-end bg-black/30 font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpenModalUser(false)}
        >
          <div className="absolute top-16 right-56 z-50">
            <motion.div
              className="bg-white w-96 rounded-md border-2 border-segundo origin-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex-1 overflow-y-auto">
                  {/* Nav */}
                  <div className="border border-black/10 rounded-md p-4">
                    {usuario ? <ConLogin /> : <SinLogin />}
                  </div>
                </div>

                {/* Footer - Fijo */}
                <div className="shrink-0 border-t border-gray-200">
                  <DescargarApp />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalUser;
