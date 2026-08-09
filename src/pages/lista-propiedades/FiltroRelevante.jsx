import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";
import { OPCIONES_ORDEN } from "@/data/opciones_orden";

const CHIPS = ["relevante", "baratos", "recientes"];

const FiltroRelevante = ({ value = "relevante", onChange }) => {
  const opcionActiva =
    OPCIONES_ORDEN.find((o) => o.id === value) ?? OPCIONES_ORDEN[0];

  const handleSelect = (opt) => {
    if (!opt) return;
    onChange(opt.id);
  };

  return (
    <div className="w-full flex items-center justify-end md:h-14 h-20 mt-4 md:mt-2 gap-2">
      <div className="text-base">Ordenar:</div>
      <div className="flex items-center gap-0">
        {OPCIONES_ORDEN.filter((o) => CHIPS.includes(o.id)).map((fil) => (
          <div
            key={fil.id}
            className={`flex items-center gap-2 px-3 py-2 border font-semibold ${
              fil.id === value
                ? "border-tercero text-tercero bg-tercero/5"
                : "border-segundo/40 text-segundo bg-primero"
            } cursor-pointer select-none justify-center`}
            onClick={() => onChange(fil.id)}
          >
            {fil.label}
          </div>
        ))}

        <Listbox value={opcionActiva} onChange={handleSelect}>
          {({ open }) => (
            <div className="relative">
              <ListboxButton
                className={`flex items-center gap-2 px-3 py-2 border font-semibold cursor-pointer select-none justify-center ${
                  open
                    ? "border-tercero text-tercero bg-tercero/5"
                    : "border-segundo/40 text-segundo bg-primero"
                }`}
              >
                {CHIPS.includes(opcionActiva.id) ? "Más" : opcionActiva.label}
                <MdArrowDropDown className="text-lg" />
              </ListboxButton>

              <ListboxOptions
                anchor="bottom"
                transition
                className="z-50 mt-1 max-h-72 overflow-y-auto border bg-primero shadow-lg w-52 transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
              >
                {OPCIONES_ORDEN.map((opt) => (
                  <ListboxOption
                    key={opt.id}
                    value={opt}
                    className={`cursor-pointer select-none px-3 py-2 border-b border-segundo/20 text-sm font-medium data-focus:bg-segundo/10 ${
                      opt.id === value
                        ? "border-tercero text-tercero bg-tercero/5 font-semibold"
                        : "text-segundo"
                    }`}
                  >
                    {opt.label}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default FiltroRelevante;
