import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const TIPOS = [
  "Obra nueva",
  "Viviendas",
  "Habitación",
  "Vacacional",
  "Garajes",
  "Trasteros",
  "Oficinas",
  "Locales o naves",
  "Traspasos",
  "Terrenos",
  "Edificios",
];

const SelectorTipo = ({ value, onChange }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="flex items-center justify-between gap-3 h-11 px-4 bg-white border border-black/10 text-sm text-black/80 md:min-w-35 w-full font-semibold">
            {value}
            <MdOutlineKeyboardArrowDown
              className={`text-black/60 text-lg shrink-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <ListboxOptions
              static={open}
              className="absolute top-full left-0 z-50 mt-1 w-full min-w-50 bg-white border border-black/10 shadow-lg max-h-60 overflow-y-auto"
            >
              {TIPOS.map((tipo) => (
                <ListboxOption
                  key={tipo}
                  value={tipo}
                  className="cursor-pointer px-4 py-3 text-sm text-black/80 data-focus:bg-tercero/3 data-selected:bg-tercero/3 data-selected:text-tercero data-selected:font-medium"
                >
                  {tipo}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default SelectorTipo;
