import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAppContext } from "@/context/AppContext";

const TipoSelect = ({
  label = "Elige el tipo de inmueble",
  placeholder = "Selecciona",
  options,
  value,
  onChange,
}) => {
  const { formDataPropiedad, setFormDataPropiedad } = useAppContext();
  const [internalValue, setInternalValue] = useState(null);
  const selected = value !== undefined ? value : internalValue;

  const handleChange = (val) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
    if (val.id === "habitacion") {
      setFormDataPropiedad({
        ...formDataPropiedad,
        tipo: val.id,
        operacion: "alquiler",
      });
    } else {
      setFormDataPropiedad({ ...formDataPropiedad, tipo: val.id });
    }
  };

  const handleButtonClick = () => {
    document.getElementById("property-select-block")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full max-w-sm font-poppins">
      <Listbox value={selected} onChange={handleChange}>
        {({ open }) => (
          <div className="relative" id="property-select-block">
            <label className="mb-3 block text-xl md:text-2xl font-semibold text-slate-900">
              {label}
            </label>

            <ListboxButton
              className={`flex w-full items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-lg text-slate-900 transition-colors focus:outline-none ${
                open
                  ? "border-rose-500 ring-1 ring-rose-600"
                  : "border-slate-300 hover:border-rose-600/50"
              }`}
              onClick={handleButtonClick}
            >
              <span>{selected ? selected.label : placeholder}</span>
              {open ? (
                <IoMdArrowDropdown className="h-5 w-5 shrink-0 text-slate-700 rotate-180" />
              ) : (
                <IoMdArrowDropdown className="h-5 w-5 shrink-0 text-slate-700" />
              )}
            </ListboxButton>

            <ListboxOptions
              anchor="bottom"
              transition
              className="z-50 mt-1 max-h-80 overflow-y-auto rounded-b-md border border-t-0 border-rose-500 bg-white shadow-lg [--anchor-gap:2px] w-(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
            >
              <ListboxOption
                value={null}
                className="cursor-pointer px-4 py-3 text-lg text-slate-900 data-focus:bg-slate-50 font-semibold"
              >
                {placeholder}
              </ListboxOption>

              {options.map((opt, i) => (
                <ListboxOption
                  key={i}
                  value={opt}
                  className="group cursor-pointer px-4 py-3 data-focus:bg-rose-300 data-selected:bg-rose-600/20 data-selected:data-focus:bg-rose-600/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-medium text-slate-900">
                        {opt.label}
                      </p>
                      {opt.description && (
                        <p className="mt-0.5 text-sm text-black/80 group-data-selected:text-black/70">
                          ({opt.description})
                        </p>
                      )}
                    </div>
                    <Check className="mt-1 h-5 w-5 shrink-0 text-slate-900 opacity-0 group-data-selected:opacity-100" />
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default TipoSelect;
