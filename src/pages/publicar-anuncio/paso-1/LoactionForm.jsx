// src/pages/publicar-anuncio/paso-1/LoactionForm.jsx
//
// Sección "Ubicación del inmueble".
// Toda la lógica vive en useDatosBasicos (llamado aquí directamente).

import LocationCascadeSelect from "@/pages/publicar-anuncio/paso-1/Locationcascadeselect.jsx";
import AddressMapModal from "@/pages/publicar-anuncio/paso-1/Addressmapmodal.jsx";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import TipoSelect from "@/pages/publicar-anuncio/components/TipoSelect";
import UbicacionMapa from "@/pages/anuncio/UbicacionMapa";
import useDatosBasicos from "@/hooks/useDatosBasicos";

const LocationForm = () => {
  const {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    country,
    state,
    city,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    barriosDeLaCiudad,
    barrioOptions,
    barrioValue,
    handleBarrioChange,
    barrioModo,
    handleBarrioManualChange,
    barrioNombre,
    streetName,
    handleStreetNameChange,
    streetNumber,
    handleStreetNumberChange,
    checkError,
    checking,
    handleCheckAddress,
    confirmedLocation,
    modalOpen,
    handleCloseModal,
    geocodeResult,
    handleConfirmLocation,
    editPosition,
    handleEditLocation,
  } = useDatosBasicos();

  return (
    <div className="flex max-w-xl flex-col gap-6 mt-6 md:mt-10 font-montserrat">
      <LocationCascadeSelect
        countries={countries}
        states={states}
        cities={cities}
        loadingCountries={loadingCountries}
        loadingStates={loadingStates}
        loadingCities={loadingCities}
        country={country}
        state={state}
        city={city}
        onCountryChange={handleCountryChange}
        onStateChange={handleStateChange}
        onCityChange={handleCityChange}
      />

      {city && barriosDeLaCiudad.length > 0 && (
        <TipoSelect
          label="Barrio (opcional)"
          placeholder="Selecciona"
          options={barrioOptions}
          value={barrioValue}
          onChange={handleBarrioChange}
        />
      )}
      {city && (barrioModo === "otro" || barriosDeLaCiudad.length === 0) && (
        <InputField
          label="Barrio (opcional)"
          value={barrioNombre}
          onChange={handleBarrioManualChange}
          placeholder="Escribe el nombre del barrio"
        />
      )}

      <InputField
        label="Nombre de la vía"
        value={streetName}
        onChange={handleStreetNameChange}
      />

      <InputField
        label="Número de vía"
        value={streetNumber}
        onChange={handleStreetNumberChange}
      />

      {checkError && <p className="text-base text-tercero">{checkError}</p>}

      <button
        type="button"
        onClick={handleCheckAddress}
        disabled={checking}
        className="w-fit rounded-md border border-slate-300 bg-slate-200 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-300 disabled:opacity-50"
      >
        {checking ? "Comprobando..." : "Comprobar dirección"}
      </button>

      {confirmedLocation && (
        <div className="flex flex-col gap-3">
          <p className="text-base text-emerald-700">
            ✓ Ubicación confirmada: {confirmedLocation.lat.toFixed(6)},{" "}
            {confirmedLocation.lng.toFixed(6)}
          </p>
          <UbicacionMapa
            lat={confirmedLocation.lat}
            lng={confirmedLocation.lng}
          />
          <button
            type="button"
            onClick={handleEditLocation}
            className="w-fit rounded-md border border-slate-300 bg-slate-200 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-300"
          >
            Editar ubicación
          </button>
        </div>
      )}

      <AddressMapModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLocation}
        geocodeResult={geocodeResult}
        initialPosition={editPosition}
        fallbackPosition={
          city ? { latitude: city.latitude, longitude: city.longitude } : null
        }
      />
    </div>
  );
};

export default LocationForm;
