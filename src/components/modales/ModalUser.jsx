import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import { MdLogout } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useModalUser } from "@/hooks/useModalUser";

const ModalUser = () => {
  const { openModalUser, setOpenModalUser, usuario } = useAppContext();
  const { name, email } = usuario || {};
  const color = getColorForOrg(usuario?.id, usuario?.name);

  const { irAPerfil, irANotificaciones, cerrarSesion } = useModalUser({
    isOpen: openModalUser,
    onClose: () => setOpenModalUser(false),
  });

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
              className="bg-white w-72 rounded-md border border-black/30 origin-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col justify-between h-full p-1">
                <div
                  className="flex gap-2 items-center p-2 border-b border-b-black/10 mb-1 cursor-pointer select-none"
                  onClick={irAPerfil}
                >
                  <div
                    className="w-10 h-10 p-4 rounded-full font-semibold flex items-center justify-center"
                    style={color}
                  >
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
                    onClick={irAPerfil}
                  >
                    <CiCircleCheck className="text-lg" /> <span>Cuenta</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                    onClick={irANotificaciones}
                  >
                    <IoMdNotificationsOutline className="text-lg" />
                    <span>Notificaciones</span>
                  </div>
                </div>
                <div className="bg-black/10 w-full h-px my-1" />
                <div
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-black/5 text-black cursor-pointer select-none text-sm"
                  onClick={cerrarSesion}
                >
                  <MdLogout className="text-lg" /> <span>Cerrar sesión</span>
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
