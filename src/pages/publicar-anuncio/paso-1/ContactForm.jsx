// src/pages/publicar-anuncio/paso-1/ContactForm.jsx
//
// Sección "Datos de contacto" (presentacional).
// La lógica (teléfonos, preferencia, PATCH silencioso) vive en useDatosBasicos.

import { X, Plus } from "lucide-react";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import TipoSelect from "@/pages/publicar-anuncio/components/TipoSelect";
import RadioGroupInput from "@/pages/publicar-anuncio/components/RadioGroupInput";
import { CONTACT_PREFERENCES, COUNTRY_CODES } from "@/data/contact_options";
import useDatosBasicos from "@/hooks/useDatosBasicos";

const ContactForm = () => {
  const {
    usuario,
    contactName,
    handleNameChange,
    phones,
    handlePhoneChange,
    handleAddPhone,
    handleRemovePhone,
    countryCode,
    handleCountryCodeChange,
    preference,
    handleChangePreference,
    opcionesTelefono,
    selectedPhoneValue,
    handleChangeSelectedPhone,
    guardandoContacto,
    handleContinuarContacto,
  } = useDatosBasicos();

  const usaTelefono = preference.id !== "solo_chat";

  return (
    <div className="flex max-w-xl flex-col gap-10 font-poppins">
      <div className="flex max-w-xl flex-col gap-6">
        <h2 className="text-2xl font-bold text-slate-900 mt-10">
          Tus datos de contacto
        </h2>

        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Tu email
          </label>
          <input
            value={usuario?.email ?? ""}
            readOnly
            className="w-96 cursor-default rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-base text-slate-900 focus:outline-none"
          />
          <p className="mt-2 text-sm text-slate-500">
            Nunca se verá en el anuncio, solo para avisos y notificaciones.
          </p>
        </div>

        <InputField
          label="Tu nombre"
          value={contactName}
          onChange={handleNameChange}
          placeholder="Tu nombre completo"
        />

        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Prefijo
          </label>
          <TipoSelect
            placeholder="Selecciona"
            options={COUNTRY_CODES}
            value={countryCode}
            onChange={handleCountryCodeChange}
            getLabel={(o) => `${o.flag} ${o.code}`}
            disabled
          />
          <p className="mt-2 text-sm text-slate-500">
            Colombia por defecto. Se agregará automáticamente a tus teléfonos.
          </p>
        </div>

        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Tus teléfonos
          </label>
          <div className="flex flex-col gap-3">
            {phones.map((phone, i) => (
              <div key={i} className="flex items-start gap-2">
                <InputField
                  value={phone}
                  onChange={(e) => handlePhoneChange(i, e.target.value)}
                  placeholder="Ej: 300 123 4567"
                />
                {phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(i)}
                    aria-label="Quitar teléfono"
                    className="mt-9 shrink-0 rounded-md border border-slate-300 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPhone}
            className="mt-3 inline-flex items-center gap-1 text-base text-blue-600 hover:underline"
          >
            <Plus className="h-4 w-4" /> Añadir teléfono adicional
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-semibold text-slate-900">
          ¿Cómo prefieres que te contacten?
        </h3>
        <RadioGroupInput
          options={CONTACT_PREFERENCES}
          value={preference}
          onChange={handleChangePreference}
        />
      </div>

      {usaTelefono && opcionesTelefono.length > 1 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold text-slate-900">
            ¿Por cuál número te contactamos?
          </h3>
          <RadioGroupInput
            options={opcionesTelefono}
            value={selectedPhoneValue}
            onChange={handleChangeSelectedPhone}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleContinuarContacto}
        disabled={guardandoContacto}
        className="w-full rounded-md bg-tercero px-6 py-3 text-base font-semibold text-white hover:bg-tercero/80 active:scale-[0.99] cursor-pointer select-none disabled:opacity-50"
      >
        {guardandoContacto
          ? "Guardando..."
          : "Continuar a detalles del anuncio"}
      </button>

      <p className="text-base text-slate-700">
        En el siguiente paso puedes introducir las características y precio.
      </p>
    </div>
  );
};

export default ContactForm;
