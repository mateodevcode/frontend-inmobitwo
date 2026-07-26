import { useState } from "react";
import {
  Field,
  Label,
  Description,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  Radio,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown, Minus, Plus, Info } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import usePropiedades from "@/hooks/usePropiedades";

/* ============================================================
   PIEZAS REUTILIZABLES
   ============================================================ */

// ---- Checkbox individual con label (y descripción opcional) ----
function CheckboxItem({ checked, onChange, label, description }) {
  return (
    <Field className="flex items-start gap-2.5 py-1.5">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="group mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-400 bg-white data-checked:border-slate-900 data-checked:bg-slate-900"
      >
        <svg
          className="h-3.5 w-3.5 stroke-white opacity-0 group-data-checked:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Checkbox>
      <span>
        <Label className="block text-base text-slate-900">{label}</Label>
        {description && (
          <Description className="mt-0.5 block text-sm text-slate-500">
            {description}
          </Description>
        )}
      </span>
    </Field>
  );
}

// ---- Grupo de checkboxes (selección múltiple, no es RadioGroup) ----
function CheckboxGroup({ title, options, values, onToggle }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <div className="flex flex-col">
        {options.map((opt) => (
          <CheckboxItem
            key={opt.id}
            checked={values.includes(opt.id)}
            onChange={(checked) => onToggle(opt.id, checked)}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Radio simple (un solo título, sin descripción) ----
function SimpleRadioGroup({ title, options, value, onChange }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <RadioGroup
        value={value}
        onChange={onChange}
        className="flex flex-col gap-3"
      >
        {options.map((opt) => (
          <Radio
            key={opt.id}
            value={opt.id}
            className="group flex cursor-pointer items-center gap-3"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 group-data-checked:border-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900 opacity-0 group-data-checked:opacity-100" />
            </span>
            <span className="text-base text-slate-900">{opt.label}</span>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

// ---- Input numérico tipo stepper (-, valor, +) ----
function NumberStepper({ value, onChange, min = 0, max = 99 }) {
  const display = value === null || value === undefined ? "" : String(value);

  const dec = () => onChange(Math.max(min, (value ?? min) - 1));
  const inc = () => onChange(Math.min(max, (value ?? min - 1) + 1));

  return (
    <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-300">
      <button
        type="button"
        onClick={dec}
        aria-label="Disminuir"
        className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          onChange(v === "" ? null : Math.min(max, Math.max(min, Number(v))));
        }}
        className="h-12 w-14 border-x border-slate-300 text-center text-base text-slate-900 focus:outline-none"
      />
      <button
        type="button"
        onClick={inc}
        aria-label="Aumentar"
        className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---- Input con sufijo de unidad (m², kWh/m² año, euros/mes...) ----
function UnitInput({ value, onChange, unit, placeholder }) {
  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-md border border-slate-300 px-3 py-3 pr-20 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-base text-slate-500">
        {unit}
      </span>
    </div>
  );
}

// ---- Select simple ----
function SimpleSelect({ options, value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`flex w-full items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-base text-slate-900 focus:outline-none ${
              open ? "border-slate-900" : "border-slate-300"
            }`}
          >
            <span>{value}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-700" />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            transition
            className="z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg w-(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt}
                value={opt}
                className="cursor-pointer px-4 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
              >
                {opt}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}

// ---- Banner de aviso (info amarillo) ----
function InfoBanner({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-amber-50 px-4 py-3.5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 fill-slate-900 text-amber-50" />
      <p className="text-base text-slate-900">{children}</p>
    </div>
  );
}

/* ============================================================
   DATOS DE EJEMPLO
   ============================================================ */

const TIPO_PISO = [
  { id: "piso", label: "Piso" },
  { id: "atico", label: "Ático" },
  { id: "duplex", label: "Dúplex" },
  { id: "estudio", label: "Estudio / loft" },
];

const ESTADO = [
  { id: "reformar", label: "A reformar" },
  { id: "buen_estado", label: "Buen estado" },
];

const FACHADA = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
];

const EQUIPAMIENTO = [
  { id: "sin_nada", label: "Cocina no equipada y casa sin muebles" },
  { id: "cocina_eq", label: "Cocina equipada y casa sin muebles" },
  { id: "cocina_muebles", label: "Cocina equipada y casa amueblada" },
];

const ASCENSOR = [
  { id: "si", label: "Sí tiene" },
  { id: "no", label: "No tiene" },
];

const ORIENTACION = [
  { id: "norte", label: "Norte" },
  { id: "sur", label: "Sur" },
  { id: "este", label: "Este" },
  { id: "oeste", label: "Oeste" },
];

const VIVIENDA_FEATURES = [
  { id: "armarios", label: "Armarios empotrados" },
  { id: "aire", label: "Aire acondicionado" },
  { id: "terraza", label: "Terraza" },
  { id: "balcon", label: "Balcón" },
  { id: "trastero", label: "Trastero" },
  { id: "garaje", label: "Garaje" },
];

const EDIFICIO_FEATURES = [
  { id: "piscina", label: "Piscina" },
  { id: "zona_verde", label: "Zona verde" },
];

const MOVILIDAD_FEATURES = [
  {
    id: "acceso_exterior",
    label:
      "El acceso exterior a la vivienda está adaptado para silla de ruedas",
    description:
      "Tiene rampas y ascensor de 6 plazas o la vivienda está a pie de calle sin bordillos.",
  },
  {
    id: "interior",
    label: "El interior de la vivienda está adaptado para silla de ruedas",
    description:
      "Puertas y pasillos amplios, barras abatibles, suelos antideslizantes…",
  },
];

const RATING_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function PropertyCharacteristicsForm() {
  const { setContentNumber, formDataPropiedad, setFormDataPropiedad } = useAppContext();
  const { publicarDataAnuncio } = usePropiedades();
  const [loading, setLoading] = useState(false);
  const [tipoPiso, setTipoPiso] = useState([]);
  const [estado, setEstado] = useState(null);
  const [m2Construidos, setM2Construidos] = useState("");
  const [m2Utiles, setM2Utiles] = useState("");

  const [habitaciones, setHabitaciones] = useState(null);
  const [banos, setBanos] = useState(null);
  const [fachada, setFachada] = useState(null);
  const [equipamiento, setEquipamiento] = useState(null);

  const [ascensor, setAscensor] = useState(null);
  const [califEnergia, setCalifEnergia] = useState("B");
  const [consumoEnergia, setConsumoEnergia] = useState("");
  const [califEmisiones, setCalifEmisiones] = useState("C");
  const [consumoEmisiones, setConsumoEmisiones] = useState("");

  const [orientacion, setOrientacion] = useState([]);
  const [viviendaFeatures, setViviendaFeatures] = useState([]);
  const [edificioFeatures, setEdificioFeatures] = useState([]);

  const [maxInquilinos, setMaxInquilinos] = useState(null);
  const [apropiadoNinos, setApropiadoNinos] = useState(false);
  const [admiteMascotas, setAdmiteMascotas] = useState(false);

  const [movilidad, setMovilidad] = useState([]);

  const [descripcion, setDescripcion] = useState("");

  const toggleIn = (arr, setArr) => (id, checked) => {
    setArr(checked ? [...arr, id] : arr.filter((x) => x !== id));
  };

  return (
    <div className="flex max-w-2xl flex-col gap-10 font-montserrat">
      {/* ---- Características del piso ---- */}
      <div className="flex flex-col gap-7 mt-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Características del piso
        </h2>

        <CheckboxGroup
          title="Tipo de piso (opcional)"
          options={TIPO_PISO}
          values={tipoPiso}
          onToggle={toggleIn(tipoPiso, setTipoPiso)}
        />

        <SimpleRadioGroup
          title="Estado"
          options={ESTADO}
          value={estado}
          onChange={setEstado}
        />

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            m² construidos
          </Label>
          <UnitInput
            value={m2Construidos}
            onChange={setM2Construidos}
            unit="m²"
          />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            m² útiles (opcional)
          </Label>
          <UnitInput value={m2Utiles} onChange={setM2Utiles} unit="m²" />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Número de habitaciones en la vivienda
          </Label>
          <NumberStepper value={habitaciones} onChange={setHabitaciones} />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Número de baños y aseos
          </Label>
          <NumberStepper value={banos} onChange={setBanos} />
        </Field>

        <SimpleRadioGroup
          title="Fachada del inmueble"
          options={FACHADA}
          value={fachada}
          onChange={setFachada}
        />

        <SimpleRadioGroup
          title="Equipamiento"
          options={EQUIPAMIENTO}
          value={equipamiento}
          onChange={setEquipamiento}
        />

        <SimpleRadioGroup
          title="¿Tiene ascensor?"
          options={ASCENSOR}
          value={ascensor}
          onChange={setAscensor}
        />
      </div>

      {/* ---- Certificado energético ---- */}
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-slate-900">
            Certificado energético
          </h2>
          <a href="#" className="text-base text-blue-600 hover:underline">
            ¿Qué información debes rellenar?
          </a>
        </div>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Calificación de consumo de energía
          </Label>
          <SimpleSelect
            options={RATING_LETTERS}
            value={califEnergia}
            onChange={setCalifEnergia}
          />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Consumo de energía (opcional)
          </Label>
          <UnitInput
            value={consumoEnergia}
            onChange={setConsumoEnergia}
            unit="kWh/m² año"
          />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Calificación de emisiones
          </Label>
          <SimpleSelect
            options={RATING_LETTERS}
            value={califEmisiones}
            onChange={setCalifEmisiones}
          />
        </Field>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Consumo de emisiones (opcional)
          </Label>
          <UnitInput
            value={consumoEmisiones}
            onChange={setConsumoEmisiones}
            unit="kg CO2/m² año"
          />
        </Field>
      </div>

      {/* ---- Orientación y extras ---- */}
      <div className="flex flex-col gap-7">
        <CheckboxGroup
          title="Orientación (opcional)"
          options={ORIENTACION}
          values={orientacion}
          onToggle={toggleIn(orientacion, setOrientacion)}
        />

        <CheckboxGroup
          title="Otras características de tu vivienda"
          options={VIVIENDA_FEATURES}
          values={viviendaFeatures}
          onToggle={toggleIn(viviendaFeatures, setViviendaFeatures)}
        />

        <CheckboxGroup
          title="Otras características de tu edificio"
          options={EDIFICIO_FEATURES}
          values={edificioFeatures}
          onToggle={toggleIn(edificioFeatures, setEdificioFeatures)}
        />
      </div>

      {/* ---- ¿Qué inquilinos buscas? ---- */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mb-1 text-3xl font-bold text-slate-900">
            ¿Qué inquilinos buscas?
          </h2>
          <p className="text-base text-slate-700">
            Esta sección ayuda a que te contacten los inquilinos que más cuadran
            con tu vivienda.
          </p>
        </div>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Número máximo de inquilinos (opcional)
          </Label>
          <NumberStepper value={maxInquilinos} onChange={setMaxInquilinos} />
          <Description className="mt-2 block text-sm text-slate-500">
            Si no quieres poner máximo, déjalo vacío
          </Description>
        </Field>

        <CheckboxGroup
          title="¿Apropiado para niños (0-12 años)?"
          options={[
            { id: "ninos", label: "La vivienda es apropiada para niños" },
          ]}
          values={apropiadoNinos ? ["ninos"] : []}
          onToggle={(_, checked) => setApropiadoNinos(checked)}
        />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              ¿Admites mascotas?
            </h3>
            <button
              type="button"
              title="Indica si en tu anuncio se permiten mascotas."
              aria-label="Más información sobre mascotas"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            >
              i
            </button>
          </div>
          <CheckboxItem
            checked={admiteMascotas}
            onChange={setAdmiteMascotas}
            label="Sí, admito mascotas"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              ¿La vivienda está adaptada para personas con movilidad reducida?
            </h3>
            <button
              type="button"
              title="Marca las opciones que apliquen a tu vivienda."
              aria-label="Más información sobre accesibilidad"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            >
              i
            </button>
          </div>
          <div className="flex flex-col">
            {MOVILIDAD_FEATURES.map((opt) => (
              <CheckboxItem
                key={opt.id}
                checked={movilidad.includes(opt.id)}
                onChange={(checked) =>
                  setMovilidad(
                    checked
                      ? [...movilidad, opt.id]
                      : movilidad.filter((x) => x !== opt.id),
                  )
                }
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        {/* ---- Disclosure: Añadir más detalles ---- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <DisclosureButton className="flex items-center gap-1.5 text-base font-semibold text-blue-600 hover:underline">
                <span>Añadir más detalles (opcional)</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </DisclosureButton>
              <DisclosurePanel className="mt-4 flex flex-col gap-4 border-l-2 border-slate-200 pl-4">
                <p className="text-sm text-slate-500">
                  Aquí puedes añadir campos opcionales adicionales (referencia
                  catastral, gastos de comunidad, año de construcción, etc.)
                  según los necesite tu formulario real.
                </p>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      </div>

      {/* ---- Precio del inmueble ---- */}
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-slate-900">
          Precio del inmueble
        </h2>

        <Field>
          <Label className="mb-2 block text-base font-semibold text-slate-900">
            Precio
          </Label>
          <UnitInput
            value={formDataPropiedad.precio || ""}
            onChange={(v) =>
              setFormDataPropiedad((prev) => ({ ...prev, precio: v }))
            }
            unit="COP"
          />
          <Description className="mt-2 block text-sm text-slate-500">
            Precio en pesos colombianos
          </Description>
        </Field>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Fianza: 1 mes
          </h3>
          <p className="mt-1 text-base text-slate-700">
            Para los alquileres residenciales (de vivienda habitual), la Ley de
            Arrendamientos Urbanos (LAU), requiere un mes de fianza.
          </p>
        </div>
      </div>

      {/* ---- Descripción del anuncio ---- */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="mb-1 text-3xl font-bold text-slate-900">
            Descripción del anuncio
          </h2>
          <p className="text-base text-slate-700">
            Aprovecha para comentar cosas que no te hayamos preguntado y no
            estén en las fotos: el suelo de parqué, el tipo de calefacción,
            ¿tiene tendedero?
          </p>
        </div>

        <InfoBanner>
          Los anuncios con comentarios racistas, homófobos y/o discriminatorios
          serán eliminados.
        </InfoBanner>

        <Field>
          <Label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
            <span aria-hidden="true">🇪🇸</span> En español
          </Label>
          <Textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            placeholder="Escribe aquí la descripción en español, más tarde podrás añadir otros idiomas."
            className="block w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
          />
        </Field>

        <p className="text-base text-slate-700">
          Más tarde podrás añadir otros idiomas
        </p>
        <p className="text-base text-slate-700">
          Las mayúsculas son más difíciles de leer, por lo que no permitimos
          toda la descripción en mayúsculas.
        </p>

        <button
          type="button"
          onClick={(e) => {
            publicarDataAnuncio(e, setLoading);
            document.getElementById("top-detalles")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="w-full rounded-md bg-rose-600 px-6 py-4 text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
        >
          Continuar a fotos del anuncio
        </button>
      </div>
    </div>
  );
}
