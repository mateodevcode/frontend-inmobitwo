import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import BotonDescartar from "./BotonDescartar";
import BotonFavorito from "./BotonFavorito";

const HeaderDinamico = ({ onClose, inmueble, specsLinea }) => {
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-5 py-2.5 font-poppins">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-700 shrink-0"
          title="Volver"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="text-2xl" />
        </button>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {inmueble.titulo}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {formatPrecioCompleto(inmueble.precio)}
            {inmueble.operacion_slug === "arriendo" ? "/mes" : ""}
            {specsLinea.length > 0 ? ` · ${specsLinea.join(" · ")}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <BotonFavorito />
        <BotonDescartar compact />
      </div>
    </div>
  );
};

export default HeaderDinamico;
