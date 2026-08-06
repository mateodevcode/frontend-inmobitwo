// src/components/publicar-anuncio/components/LoactionForm.jsx
//
// Une todo el flujo: País → Provincia → Ciudad → Dirección → "Comprobar dirección"
// → geocodifica vía tu backend (/api/geocode) → abre AddressMapModal → confirma.
//
// Este es el componente que conectarías en el wizard de "Ubicación del inmueble".

import { useState } from "react";
import { Field, Label, Input } from "@headlessui/react";
import LocationCascadeSelect from "@/pages/publicar-anuncio/paso-1/Locationcascadeselect.jsx";
import AddressMapModal from "@/pages/publicar-anuncio/paso-1/Addressmapmodal.jsx";
import { apiBackend } from "@/api/apiBackend.js";
import { useAppContext } from "@/context/AppContext.js";

export default function LocationForm({ onLocationConfirmed }) {
  const {
    setFormDataPropiedad,
    setComprobarDireccion,
    confirmedLocation,
    setConfirmedLocation,
  } = useAppContext();
  const [geo, setGeo] = useState({ country: null, state: null, city: null });
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");

  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState(null);
  // const [confirmedLocation, setConfirmedLocation] = useState(null);

  const { country, state, city } = geo;

  async function handleCheckAddress() {
    if (!country || !state || !city || !streetName.trim()) {
      setCheckError(
        "Completa país, provincia, ciudad y la dirección antes de comprobar.",
      );
      return;
    }

    setCheckError(null);
    setChecking(true);

    const fullAddress = [
      `${streetName}${streetNumber ? " " + streetNumber : ""}`,
      city.name,
      state.name,
      country.name,
    ].join(", ");

    const res = await apiBackend(
      `/api/geocode?address=${encodeURIComponent(fullAddress)}`,
      "GET",
    );

    setChecking(false);

    if (res.success) {
      setGeocodeResult(res.data); // { latitude, longitude, displayName, importance }
    } else {
      // 404 de Nominatim también pasa por aquí (res.success === false)
      setGeocodeResult(null);
    }

    setModalOpen(true);
  }

  function handleConfirmLocation({ lat, lng }) {
    const location = {
      lat,
      lng,
      country,
      state,
      city,
      streetName,
      streetNumber,
    };
    setConfirmedLocation(location);
    setFormDataPropiedad((prev) => ({
      ...prev,
      latitude: lat ?? 0.0,
      longitude: lng ?? 0.0,
    }));
    setComprobarDireccion(true);
    setModalOpen(false);
    onLocationConfirmed?.(location);
  }

  return (
    <div className="flex max-w-xl flex-col gap-6 mt-6 md:mt-10 font-montserrat">
      <h2 className="text-xl font-bold text-slate-900">
        Ubicación del inmueble
      </h2>

      <LocationCascadeSelect
        onChange={(newGeo) => {
          setGeo(newGeo);
          setFormDataPropiedad((prev) => ({
            ...prev,
            country_id: newGeo.country?.id ?? 0,
            state_id: newGeo.state?.id ?? 0,
            city_id: newGeo.city?.id ?? 0,
          }));
        }}
      />

      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Nombre de la vía
        </Label>
        <Input
          value={streetName}
          onChange={(e) => {
            setStreetName(e.target.value);
            setFormDataPropiedad((prev) => ({
              ...prev,
              direccion: e.target.value,
            }));
          }}
          className="block w-full rounded-md border border-slate-300 px-3 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
        />
      </Field>

      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Número de vía
        </Label>
        <Input
          value={streetNumber}
          onChange={(e) => {
            setStreetNumber(e.target.value);
            setFormDataPropiedad((prev) => ({
              ...prev,
              numero_direccion: e.target.value,
            }));
          }}
          className="block w-full rounded-md border border-slate-300 px-3 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
        />
      </Field>

      {checkError && <p className="text-base text-red-600">{checkError}</p>}

      <button
        type="button"
        onClick={handleCheckAddress}
        disabled={checking}
        className="w-fit rounded-md border border-slate-300 bg-slate-200 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-300 disabled:opacity-50"
      >
        {checking ? "Comprobando..." : "Comprobar dirección"}
      </button>

      {confirmedLocation && (
        <p className="text-base text-emerald-700">
          ✓ Ubicación confirmada: {confirmedLocation.lat.toFixed(6)},{" "}
          {confirmedLocation.lng.toFixed(6)}
        </p>
      )}

      <AddressMapModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmLocation}
        geocodeResult={geocodeResult}
        fallbackPosition={
          city ? { latitude: city.latitude, longitude: city.longitude } : null
        }
      />
    </div>
  );
}
