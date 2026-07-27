import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { MdLogout } from "react-icons/md";
import { useModalUser } from "@/hooks/useModalUser";
import { useNavigate } from "react-router-dom";

const ModalUserPropiedadId = () => {
  const { openModalUserPropiedadId, setModalUserPropiedadId, usuario } =
    useAppContext();
  const { name } = usuario || {};
  const navigate = useNavigate();

  useModalUser({
    isOpen: openModalUserPropiedadId,
    onClose: () => setModalUserPropiedadId(false),
  });

  if (!usuario) return null;

  return (
    <AnimatePresence>
      {openModalUserPropiedadId && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-end font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setModalUserPropiedadId(false)}
        >
          <motion.div className="w-full h-svh flex flex-col overflow-hidden"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="absolute bg-white w-80 rounded-md border border-black/30 top-10 right-8 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col justify-between h-full p-1">
                <div
                  className="flex gap-2 items-center p-2 border-b border-b-black/10 mb-1 hover:bg-black/5 rounded-md cursor-pointer select-none active:scale-95 duration-75"
                  onClick={() => {
                    setModalUserPropiedadId(false);
                    navigate("/usuario/tus-datos/perfil");
                  }}
                >
                  <div className="w-10 h-10 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center">
                    {getInitials(name)}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-black text-lg">
                      {formatFirstTwoNames(name)}
                    </p>
                  </div>
                </div>
                <div className="bg-black/10 w-full h-px my-1" />
                <div
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                  onClick={() => {
                    setModalUserPropiedadId(false);
                    navigate("/usuario/tus-datos/perfil");
                  }}
                >
                  <MdLogout /> <span>Cerrar sesión</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalUserPropiedadId;
