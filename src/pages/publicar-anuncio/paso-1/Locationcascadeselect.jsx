// src/components/publicar-anuncio/components/Locationcascadeselect.jsx

import { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Field,
  Label,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

// ---- Select reutilizable (mismo patrón que SimpleSelect de pantallas anteriores) ----
function GeoSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  loading,
}) {
  return (
    <Field>
      <Label className="mb-2 block md:text-lg font-semibold text-slate-900">
        {label}
      </Label>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <ListboxButton
              className={`flex w-full items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-base focus:outline-none ${
                disabled
                  ? "cursor-not-allowed bg-slate-50 text-slate-400"
                  : "text-slate-900"
              } ${open ? "border-slate-900" : "border-slate-300 hover:border-slate-400"}`}
            >
              <span>
                {loading ? "Cargando..." : value ? value.name : placeholder}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
            </ListboxButton>

            {!disabled && (
              <ListboxOptions
                anchor="bottom"
                transition
                className="z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg w-[var(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
              >
                {options.length === 0 && !loading && (
                  <div className="px-4 py-2.5 text-base text-slate-400">
                    Sin resultados
                  </div>
                )}
                {options.map((opt) => (
                  <ListboxOption
                    key={opt.id}
                    value={opt}
                    className="group flex cursor-pointer items-center justify-between px-4 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
                  >
                    <span>{opt.name}</span>
                    <Check className="h-4 w-4 shrink-0 text-slate-900 opacity-0 group-data-selected:opacity-100" />
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </div>
        )}
      </Listbox>
    </Field>
  );
}

export default function LocationCascadeSelect({ onChange }) {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const { data: countries, loading: loadingCountries } =
    useGeo("/api/countries");

  const { data: states, loading: loadingStates } = useGeo(
    country ? `/api/states?countryId=${country.id}` : null,
  );

  const { data: cities, loading: loadingCities } = useGeo(
    state ? `/api/cities?stateId=${state.id}` : null,
  );

  // Auto-seleccionar Colombia (por ahora solo país activo)
  useEffect(() => {
    if (countries.length > 0 && !country) {
      const colombia = countries.find((c) => c.name === "Colombia");
      if (colombia) setCountry(colombia);
    }
  }, [countries, country]);

  // Reset en cascada: cambiar país limpia provincia y ciudad
  function handleCountryChange(newCountry) {
    setCountry(newCountry);
    setState(null);
    setCity(null);
  }

  // Reset en cascada: cambiar provincia limpia ciudad
  function handleStateChange(newState) {
    setState(newState);
    setCity(null);
  }

  // Notifica al padre (ej. el formulario de "Ubicación del inmueble") cada vez
  // que cambia la selección completa.
  useEffect(() => {
    onChange?.({ country, state, city });
  }, [country, state, city]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <GeoSelect
        label="País"
        placeholder="Selecciona un país"
        options={countries}
        value={country}
        onChange={handleCountryChange}
        loading={loadingCountries}
      />

      <GeoSelect
        label="Provincia / Departamento"
        placeholder={country ? "Selecciona" : "Primero elige un país"}
        options={states}
        value={state}
        onChange={handleStateChange}
        disabled={!country}
        loading={loadingStates}
      />

      <GeoSelect
        label="Ciudad"
        placeholder={state ? "Selecciona" : "Primero elige una provincia"}
        options={cities}
        value={city}
        onChange={setCity}
        disabled={!state}
        loading={loadingCities}
      />
    </div>
  );
}
