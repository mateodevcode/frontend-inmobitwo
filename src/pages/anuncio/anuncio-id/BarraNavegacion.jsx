import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const BarraNavegacion = ({
  onClose,
  filtroLabel,
  listaIds,
  posicion,
  onNavigateTo,
  total,
}) => {
  return (
    <div className="w-full md:h-12 h-24 bg-white flex items-center">
      <div className="mx-auto w-9/12 flex items-center md:flex-row flex-col justify-between gap-4">
        <button
          onClick={onClose}
          className="flex items-center justify-center cursor-pointer select-none gap-2 font-poppins text-blue-600 hover:underline hover:text-blue-700"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="text-xl shrink-0" />
          <span className="truncate text-sm">
            {filtroLabel || "Volver a resultados"}
          </span>
        </button>

        {listaIds && listaIds.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTo("anterior")}
              disabled={posicion <= 0}
              className="flex items-center justify-center cursor-pointer select-none gap-1 font-poppins text-blue-600 hover:underline hover:text-blue-700 disabled:text-gray-300 disabled:cursor-default disabled:no-underline"
            >
              <MdOutlineKeyboardArrowLeft className="text-2xl" />
              <span className="text-sm">Anterior</span>
            </button>

            <p className="text-sm text-gray-500 whitespace-nowrap">
              {posicion + 1} de {total || listaIds.length} viviendas
            </p>

            <button
              onClick={() => onNavigateTo("siguiente")}
              disabled={posicion >= (total || listaIds.length) - 1}
              className="flex items-center justify-center cursor-pointer select-none gap-1 font-poppins text-blue-600 hover:underline hover:text-blue-700 disabled:text-gray-300 disabled:cursor-default disabled:no-underline"
            >
              <span className="text-sm">Siguiente</span>
              <MdOutlineKeyboardArrowRight className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarraNavegacion;
