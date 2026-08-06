import { useState } from "react";
import {
  Field,
  Label,
  Input,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  RadioGroup,
  Radio,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const COUNTRY_CODES = [
  { id: "es", code: "+34", flag: "🇪🇸", name: "España" },
  { id: "mx", code: "+52", flag: "🇲🇽", name: "México" },
  { id: "ar", code: "+54", flag: "🇦🇷", name: "Argentina" },
  { id: "co", code: "+57", flag: "🇨🇴", name: "Colombia" },
  { id: "us", code: "+1", flag: "🇺🇸", name: "Estados Unidos" },
];

const CONTACT_PREFERENCES = [
  {
    id: "telefono_chat",
    label: "Teléfono y mensajes en nuestro chat (recomendado)",
    description:
      "Recibirás un aviso de los mensajes por email y notificaciones en nuestra app",
  },
  {
    id: "solo_chat",
    label: "Sólo por mensajes de chat",
    description:
      "Recibirás un aviso de los mensajes por email y notificaciones en nuestra app",
  },
  {
    id: "solo_telefono",
    label: "Sólo por teléfono",
  },
];

// ---- Select de código de país (compacto, pegado al input) ----
function CountryCodeSelect({ value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`flex h-full items-center gap-1 rounded-l-md border border-r-0 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none ${
              open ? "border-slate-900" : "border-slate-300"
            }`}
          >
            <span>{value.code}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom start"
            transition
            className="z-50 mt-1 max-h-64 w-56 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
          >
            {COUNTRY_CODES.map((c) => (
              <ListboxOption
                key={c.id}
                value={c}
                className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                <span className="text-sm text-slate-500">{c.name}</span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}

// ---- Sección "Tus datos de contacto" ----
function ContactDataSection({
  email,
  onSwitchAccountHref = "#",
  name,
  onNameChange,
  phone,
  onPhoneChange,
  countryCode,
  onCountryCodeChange,
  onAddExtraPhone,
}) {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900 mt-10">
        Tus datos de contacto
      </h2>

      {/* Email (solo lectura) */}
      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Tu email
        </Label>
        <Input
          value={email}
          readOnly
          className="block w-full cursor-default rounded-md border border-slate-300 bg-slate-100 px-3 py-3 text-base text-slate-900 focus:outline-none"
        />
        <p className="mt-2 text-sm text-slate-500">
          Nunca se verá en el anuncio, solo para avisos y notificaciones.
        </p>
        <a
          href={onSwitchAccountHref}
          className="mt-2 inline-block text-base text-blue-600 hover:underline"
        >
          Entrar en otra cuenta
        </a>
      </Field>

      {/* Teléfono */}
      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Tu teléfono
        </Label>
        <div className="flex">
          <CountryCodeSelect
            value={countryCode}
            onChange={onCountryCodeChange}
          />
          <Input
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            type="tel"
            className="block w-full rounded-r-md border border-slate-300 px-3 py-3 text-base text-slate-900 focus:border-tercero focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onAddExtraPhone}
          className="mt-2 inline-block text-base text-blue-600 hover:underline"
        >
          Añadir teléfono adicional
        </button>
      </Field>

      {/* Nombre */}
      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Tu nombre
        </Label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="block w-full rounded-md border border-slate-300 px-3 py-3 text-base text-slate-900 focus:border-tercero focus:outline-none"
        />
        <p className="mt-2 text-sm text-slate-500">
          Aparecerá en tu anuncio y cuando escribas a otros usuarios
        </p>
      </Field>
    </div>
  );
}

// ---- Sección "¿Cómo prefieres que te contacten?" ----
function ContactPreferenceSection({
  value,
  onChange,
  options = CONTACT_PREFERENCES,
  onSubmit,
}) {
  return (
    <div className="flex max-w-xl flex-col gap-5">
      <h3 className="text-xl font-semibold text-slate-900">
        ¿Cómo prefieres que te contacten?
      </h3>

      <RadioGroup
        value={value}
        onChange={onChange}
        className="flex flex-col gap-4"
      >
        {options.map((opt) => (
          <Radio
            key={opt.id}
            value={opt}
            className="group flex cursor-pointer items-start gap-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 group-data-checked:border-tercero">
              <span className="h-2.5 w-2.5 rounded-full bg-tercero opacity-0 group-data-checked:opacity-100" />
            </span>
            <span>
              <span className="block text-base text-slate-900 group-data-checked:text-tercero">
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 block text-sm text-slate-500">
                  {opt.description}
                </span>
              )}
            </span>
          </Radio>
        ))}
      </RadioGroup>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full rounded-md bg-tercero px-6 py-3 text-base font-semibold text-white hover:bg-tercero/80 active:scale-[0.99] cursor-pointer select-none"
      >
        Continuar a detalles del anuncio
      </button>

      <p className="text-base text-slate-700">
        En el siguiente paso puedes introducir las características y precio.
      </p>
    </div>
  );
}

// ---- Ejemplo de uso combinado ----
export default function ContactForm() {
  const [name, setName] = useState("Mateo Lizcano Noriega");
  const [phone, setPhone] = useState("675464502");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [preference, setPreference] = useState(CONTACT_PREFERENCES[0]);
  const { usuario, setContentNumber } = useAppContext();

  return (
    <div className="flex flex-col gap-10">
      <ContactDataSection
        email={usuario?.email}
        name={name}
        onNameChange={setName}
        phone={phone}
        onPhoneChange={setPhone}
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        onAddExtraPhone={() => console.log("añadir teléfono adicional")}
      />

      <ContactPreferenceSection
        value={preference}
        onChange={setPreference}
        onSubmit={() => {
          setContentNumber(1);
          document.getElementById("top-detalles")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
      />
    </div>
  );
}

export { ContactDataSection, ContactPreferenceSection };
