import { SlOptionsVertical } from "react-icons/sl";
import BotonUsuario from "@/pages/usuario/BotonUsuario";
import { useAppContext } from "@/context/AppContext";

const FooterSidebar = () => {
  const { openModalUser, setOpenModalUser, setOpenModalSidebar } =
    useAppContext();

  return (
    <div className="flex font-poppins items-center justify-between p-2">
      <div className="hover:bg-black/5 flex items-center justify-between w-full rounded-md p-2 cursor-pointer select-none border-transparent border hover:border-black/10">
        <BotonUsuario
          mostrarNombre
          tamano="lg"
          onClick={() => {}}
        />
        <div
          className="hover:bg-black/5 p-3 rounded-full cursor-pointer select-none"
          onClick={() => {
            setOpenModalUser(!openModalUser);
            setOpenModalSidebar(false);
          }}
        >
          <SlOptionsVertical className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default FooterSidebar;
