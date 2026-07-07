import { LuSearch } from "react-icons/lu";
import useTypingPlaceholder from "@/hooks/useTypingPlaceholder";
import { frases_buscar } from "@/data/frases_buscar";
import { FunnelX } from "lucide-react";
import { VscSettings } from "react-icons/vsc";

const InputSearchPrincipal = ({ setSearch, search }) => {
  const placeholderTexto = useTypingPlaceholder(frases_buscar);

  return (
    <div className="flex items-center gap-3">
      {/* Input Search */}
      <div className="hidden items-center gap-4 md:flex">
        <div className="relative flex items-center w-80 rounded-full bg-segundo/5 h-12">
          <div className="absolute left-4 text-segundo/50">
            <LuSearch className="text-black/80" />
          </div>
          <input
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
            className="focus text-segundo/80 w-48 md:w-full text-sm py-2.5 pl-10 pr-6 focus:ring-1 focus:ring-cuarto/30 focus:border-transparent outline-none transition rounded-lg border border-black/20 bg-white"
            placeholder={placeholderTexto}
          />
        </div>
        {search && (
          <button
            className="rounded-full bg-cuarto p-2.5 hover:bg-cuarto/80 cursor-pointer select-none active:scale-95 duration-75"
            onClick={() => setSearch("")}
          >
            <FunnelX className="text-primero" size={20} />
          </button>
        )}
      </div>
      {/* Boton Filtros */}
      <button className="hidden bg-white text-black w-10 h-10 rounded-md cursor-pointer select-none active:scale-95 duration-75 transition border border-black/20 md:flex items-center justify-center">
        <VscSettings />
      </button>
    </div>
  );
};

export default InputSearchPrincipal;
