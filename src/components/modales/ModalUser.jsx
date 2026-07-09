import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { MdLogout } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ModalUser = () => {
  const { openModalUser, setOpenModalUser, usuario } = useAppContext();
  const { name, email } = usuario;
  const { handleCerrarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (openModalUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalUser]);

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
          <motion.div
            className="w-full h-svh flex flex-col overflow-hidden"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="absolute bg-white w-64 rounded-md border border-black/30 bottom-6 left-6 md:left-80 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col justify-between h-full p-1">
                <div className="flex gap-2 items-center p-2 border-b border-b-black/10 mb-1">
                  <div className="w-10 h-10 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center">
                    {getInitials(name)}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-black text-sm">
                      {formatFirstTwoNames(name)}
                    </p>
                    <p className="text-xs -mt-1 lowercase">{email}</p>
                  </div>
                </div>
                <div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                    onClick={() => {
                      setOpenModalUser(false);
                      navigate("/usuario/tus-datos/perfil");
                    }}
                  >
                    <CiCircleCheck className="text-lg" /> <span>Cuenta</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                    onClick={() => {
                      setOpenModalUser(false);
                      navigate("/usuario/tus-datos/notificaciones");
                    }}
                  >
                    <IoMdNotificationsOutline className="text-lg" />
                    <span>Notificaciones</span>
                  </div>
                </div>
                <div className="bg-black/10 w-full h-px my-1" />
                <div
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                  onClick={() => {
                    setOpenModalUser(false);
                    handleCerrarSesion();
                  }}
                >
                  <MdLogout className="text-lg" /> <span>Cerrar sesión</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalUser;
