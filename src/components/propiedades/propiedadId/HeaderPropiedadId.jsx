import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoApps } from "react-icons/io5";
import BotonUsuario from "@/pages/usuario/BotonUsuario";
import { useAppContext } from "@/context/AppContext";

const HeaderPropiedadId = () => {
  const { openModalUserPropiedadId, setModalUserPropiedadId } = useAppContext();

  return (
    <div className="border-black/20 border-b flex justify-end items-center gap-3 p-2 px-4">
      <div className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer select-none active:scale-95 duration-300 transition flex items-center justify-center">
        <IoApps className="text-black text-xl" />
      </div>
      <div className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer select-none active:scale-95 duration-300 transition flex items-center justify-center">
        <IoNotifications className="text-black text-xl" />
      </div>
      <div className="relative">
        <BotonUsuario
          onClick={() => setModalUserPropiedadId(!openModalUserPropiedadId)}
        />
        <div className="bg-white border border-black/10 rounded-full w-4 h-4 flex items-center justify-center absolute bottom-0 right-0">
          <MdOutlineKeyboardArrowDown className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default HeaderPropiedadId;
