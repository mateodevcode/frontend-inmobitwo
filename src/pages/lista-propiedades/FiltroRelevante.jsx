import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const FiltroRelevante = () => {
  const [filtroSelect, setFiltroSelect] = useState("relevante");

  const filtros = [
    { nombre: "Relevante", id: "relevante" },
    { nombre: "baratos", id: "baratos" },
    { nombre: "recientes", id: "recientes" },
    { nombre: "Más", id: "mas" },
  ];

  return (
    <div className="w-full flex items-center justify-end md:h-16 h-20 mt-4 md:mt-0">
      <div className="grid grid-cols-4 md:grid-cols-5 text-sm md:mt-2">
        {/* <div className="mr-2 text-segundo">Ordenar :</div> */}
        {filtros.map((fil) => {
          return (
            <div
              key={fil.id}
              className={`flex items-center gap-2 px-3 py-2 border font-semibold ${fil.id === filtroSelect ? "border-tercero text-tercero bg-tercero/5" : "border-segundo/40 text-segundo bg-primero"} cursor-pointer select-none justify-center`}
              onClick={() => setFiltroSelect(fil.id)}
            >
              {fil.nombre}
              {fil.id === "mas" && <MdArrowDropDown />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiltroRelevante;
