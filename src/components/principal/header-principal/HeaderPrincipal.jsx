import { IoStatsChartOutline } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import InputSearchPrincipal from "./InputSearchPrincipal";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const HeaderPrincipal = () => {
  const navigate = useNavigate();
  const { setOpenModalActividades, search, setSearch, setOpenModalSidebar } =
    useAppContext();

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Boton Menu */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          className="bg-white text-black w-10 h-10 rounded-md cursor-pointer select-none active:scale-95 duration-75 transition border border-black/20 flex items-center justify-center"
          onClick={() => setOpenModalSidebar(true)}
        >
          <LuMenu className="text-xl" />
        </button>
        <button
          className="bg-white text-black w-10 h-10 rounded-md cursor-pointer select-none active:scale-95 duration-75 transition border border-black/20 flex items-center justify-center"
          onClick={() => setOpenModalActividades(true)}
        >
          <IoStatsChartOutline className="text-xl" />
        </button>
      </div>

      <InputSearchPrincipal search={search} setSearch={setSearch} />
      {/* Boton publicar */}
      <button
        className="flex items-center justify-center gap-2 bg-black hover:bg-black/80 rounded-lg px-3 py-2 text-white cursor-pointer select-none active:scale-95 duration-75 transition"
        type="button"
        onClick={() => {
          navigate("/info/publicar-anuncio");
          window.scrollTo(0, 0);
        }}
      >
        <FaPlus className="text-sm" />
        <span className="font-medium text-sm">Publicar</span>
      </button>
    </div>
  );
};

export default HeaderPrincipal;
