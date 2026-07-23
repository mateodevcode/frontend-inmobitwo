import { BsFillGeoAltFill } from "react-icons/bs";
import FormFiltros from "./FormFiltros";

const FiltrosPrincipal = () => {
  return (
    <div className="w-[25%] h-full bg-primero p-6">
      <div className="w-full h-60 2xl:h-80 flex flex-col">
        <div className="w-full h-full border border-black/40 border-b-transparent rounded-sm">
          <img
            src="/tema/tema1/mapa.png"
            alt="mapa prueba"
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
        <div className="w-full h-14 border border-black/40 text-black flex items-center gap-2 justify-center font-semibold cursor-pointer select-none hover:bg-black/5">
          <BsFillGeoAltFill />
          <p>Ver en mapa</p>
        </div>
      </div>

      <FormFiltros />
    </div>
  );
};

export default FiltrosPrincipal;
