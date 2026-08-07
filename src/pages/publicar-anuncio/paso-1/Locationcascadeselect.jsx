// src/pages/publicar-anuncio/paso-1/Locationcascadeselect.jsx
//
// Cascada País → Provincia → Ciudad (presentacional).
// El estado, los fetch (useGeo) y los handlers viven en useDatosBasicos.

import TipoSelect from "@/pages/publicar-anuncio/components/TipoSelect";

const LocationCascadeSelect = ({
  countries,
  states,
  cities,
  loadingCountries,
  loadingStates,
  loadingCities,
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">
        Ubicación del inmueble
      </h2>
      <div className="flex max-w-96 flex-col gap-6 mt-6">
        <TipoSelect
          label="País"
          placeholder="Selecciona un país"
          options={countries}
          value={country}
          onChange={onCountryChange}
          loading={loadingCountries}
        />

        <TipoSelect
          label="Provincia / Departamento"
          placeholder={country ? "Selecciona" : "Primero elige un país"}
          options={states}
          value={state}
          onChange={onStateChange}
          disabled={!country}
          loading={loadingStates}
        />

        <TipoSelect
          label="Ciudad"
          placeholder={state ? "Selecciona" : "Primero elige una provincia"}
          options={cities}
          value={city}
          onChange={onCityChange}
          disabled={!state}
          loading={loadingCities}
        />
      </div>
    </div>
  );
};

export default LocationCascadeSelect;
