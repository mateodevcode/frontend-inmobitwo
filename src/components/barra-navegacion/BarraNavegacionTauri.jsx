import { isTauri } from "../../utils/isTauri.js";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const BarraNavegacionTauri = () => {
  const isDesktop = isTauri();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const lista_exclusion = ["/info/publicar-anuncio/publicar"];

  if (!isDesktop) return;

  const mostrarBarra = !lista_exclusion.includes(pathname);

  return (
    <div className="fixed bottom-1 z-50 right-2 left-2 flex items-center justify-between">
      {mostrarBarra && (
        <button
          className="text-segundo p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition border border-black/10"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackSharp className="text-xl" />
        </button>
      )}

      <div className="items-center gap-2 hidden">
        <button className="text-segundo/60 p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition border border-black/10">
          <MdKeyboardArrowLeft className="text-2xl" />
        </button>
        <button className="text-segundo/60 p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition border border-black/10">
          <MdKeyboardArrowRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default BarraNavegacionTauri;
