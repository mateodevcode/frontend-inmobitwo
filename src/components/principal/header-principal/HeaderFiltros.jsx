import { useAppContext } from "@/context/AppContext";
import { filtros_propiedades } from "@/data/filtros_propiedades";

const HeaderFiltros = () => {
  const { filtroSeleccionado, setFiltroSeleccionado } = useAppContext();

  return (
    <div className="flex items-center gap-1 my-4 flex-wrap">
      {filtros_propiedades.map((fil, i) => {
        return (
          <button
            className={`text-xs font-semibold rounded-full px-4 py-1 cursor-pointer select-none active:scale-95 duration-75 transition ${filtroSeleccionado === fil.label ? "bg-[#FF1B1C] border border-black/5 text-white" : "bg-white border border-black/10 text-black"} font-poppins`}
            onClick={() => setFiltroSeleccionado(fil.label)}
            key={i}
          >
            {fil.name}
          </button>
        );
      })}
    </div>
  );
};

export default HeaderFiltros;
