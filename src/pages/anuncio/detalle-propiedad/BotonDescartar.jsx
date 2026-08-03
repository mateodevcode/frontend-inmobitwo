import { HiOutlineTrash } from "react-icons/hi2";

/**
 * Botón "Descartar", reutilizado en CardPrincipal (texto oculto en
 * md hacia abajo) y HeaderDinamico (texto oculto en sm hacia abajo).
 */
const BotonDescartar = ({ compact = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center font-semibold text-blue-600 hover:underline ${
      compact ? "gap-1.5 text-xs" : "gap-2 text-sm"
    }`}
  >
    <HiOutlineTrash className={compact ? "text-base" : "text-lg"} />
    <span className={compact ? "hidden sm:inline" : "hidden md:flex"}>
      Descartar
    </span>
  </button>
);

export default BotonDescartar;
