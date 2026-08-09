import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { IoMdArrowDropdown } from "react-icons/io";

const SelectFiltro = ({
  placeholder = "Selecciona",
  clearable = false,
  options = [],
  value,
  onChange,
  getLabel = (opt) => opt.label ?? opt.name,
}) => {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`flex w-full items-center justify-between gap-2 rounded-md border bg-white px-4 py-3 text-left text-base text-slate-900 transition-colors focus:outline-none ${
              open
                ? "border-rose-500 ring-1 ring-rose-600"
                : "border-slate-300 hover:border-rose-600/50"
            }`}
          >
            <span className="truncate">
              {value ? getLabel(value) : placeholder}
            </span>
            <IoMdArrowDropdown
              className={`h-5 w-5 shrink-0 text-slate-700 ${
                open ? "rotate-180" : ""
              }`}
            />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            transition
            className="z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-t-0 border-rose-500 bg-white shadow-lg w-[var(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
          >
            {clearable && (
              <ListboxOption
                value={null}
                className="cursor-pointer px-4 py-2.5 text-base font-semibold text-slate-900 data-focus:bg-rose-300"
              >
                {placeholder}
              </ListboxOption>
            )}
            {options.map((opt) => (
              <ListboxOption
                key={opt.id ?? opt}
                value={opt}
                className="cursor-pointer px-4 py-2.5 text-base text-slate-900 data-focus:bg-rose-300 data-selected:bg-rose-600/20 data-selected:font-semibold"
              >
                {getLabel(opt)}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
};

export default SelectFiltro;
