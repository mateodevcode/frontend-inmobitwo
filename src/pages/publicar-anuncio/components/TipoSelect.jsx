import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";

const TipoSelect = ({
  label = "Elige el tipo de inmueble",
  description,
  placeholder = "Selecciona",
  options = [],
  value,
  onChange,
  disabled,
  loading,
  getLabel = (opt) => opt.label ?? opt.name,
  emptyText = "Sin resultados",
}) => {
  return (
    <div className="w-full font-poppins">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <div className="mb-3">
              <label className="block text-lg font-semibold text-segundo/80">
                {label}
              </label>
              {description && (
                <p className="mt-0.5 text-sm text-black/40">({description})</p>
              )}
            </div>

            <ListboxButton
              className={`flex w-96 items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-base text-segundo/80 transition-colors focus:outline-none ${
                disabled
                  ? "cursor-not-allowed opacity-40"
                  : open
                    ? "border-tercero ring-1 ring-tercero"
                    : "border-segundo/30 hover:border-tercero/50"
              }`}
            >
              <span>
                {loading
                  ? "Cargando..."
                  : value
                    ? getLabel(value)
                    : placeholder}
              </span>
              {open ? (
                <IoMdArrowDropdown className="h-5 w-5 shrink-0 text-segundo/60 rotate-180" />
              ) : (
                <IoMdArrowDropdown className="h-5 w-5 shrink-0 text-segundo/60" />
              )}
            </ListboxButton>

            {!disabled && (
              <ListboxOptions
                anchor="bottom"
                transition
                className="z-50 mt-1 max-h-80 overflow-y-auto rounded-b-md border border-t-0 border-tercero bg-primero shadow-lg [--anchor-gap:2px] w-(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0 min-w-96"
              >
                {options.length === 0 && !loading && (
                  <div className="px-4 py-3 text-lg text-segundo/20">
                    {emptyText}
                  </div>
                )}

                {options.map((opt) => (
                  <ListboxOption
                    key={opt.id}
                    value={opt}
                    className="group cursor-pointer px-4 py-3 data-focus:bg-tercero/30 data-selected:bg-tercero/20 data-selected:data-focus:bg-tercero/10"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-medium text-segundo/80">
                          {getLabel(opt)}
                        </p>
                        {opt.description && (
                          <p className="mt-0.5 text-sm text-segundo/80 group-data-selected:text-segundo/70">
                            ({opt.description})
                          </p>
                        )}
                      </div>
                      <Check className="mt-1 h-5 w-5 shrink-0 text-segundo/80 opacity-0 group-data-selected:opacity-100" />
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default TipoSelect;
