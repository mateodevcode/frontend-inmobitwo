import { useEffect, useState } from "react";
import {
  Field,
  Label,
  Description,
  Input,
  Textarea,
  Checkbox,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronDown, Minus, Plus, Info } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import usePropiedades from "@/hooks/usePropiedades";
import { apiBackend } from "@/api/apiBackend";

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

// ---- Grupo de checkboxes (selección múltiple) ----
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
            label={opt.label_es || opt.label}
            description={opt.description}
          />
        ))}
      </div>
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

// ---- Input con sufijo de unidad (m², COP...) ----
function UnitInput({ value, onChange, unit, placeholder }) {
  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-md border border-slate-300 px-3 py-3 pr-20 text-base text-slate-900 focus:border-slate-900 focus:outline-none"
      />
      {unit && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-base text-slate-500">
          {unit}
        </span>
      )}
    </div>
  );
}

// ---- Select simple (opciones {id, label}) ----
function SimpleSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona",
}) {
  const selected = options.find((o) => String(o.id) === String(value));
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`flex w-96 items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-base text-slate-900 focus:outline-none ${
              open ? "border-slate-900" : "border-slate-300"
            }`}
          >
            <span>{selected ? selected.label : placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-700" />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            transition
            className="z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg w-(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0 w-96"
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt.id}
                className="cursor-pointer px-4 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
              >
                {opt.label}
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

// ---- Sección del formulario ----
function Seccion({ titulo, children }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900">{titulo}</h2>
      {children}
    </div>
  );
}

// ---- Campo con label ----
function Campo({ label, descripcion, children }) {
  return (
    <Field>
      <Label className="mb-2 block text-base font-semibold text-slate-900">
        {label}
      </Label>
      {children}
      {descripcion && (
        <Description className="mt-2 block text-sm text-slate-500">
          {descripcion}
        </Description>
      )}
    </Field>
  );
}

const ESTRATOS = [1, 2, 3, 4, 5, 6];
const PARQUEADERO_TIPOS = [
  { id: "cubierto", label: "Cubierto" },
  { id: "descubierto", label: "Descubierto" },
];
const PARQUEADERO_MODOS = [
  { id: "privado", label: "Privado" },
  { id: "comunal", label: "Comunal" },
];
const ZONAS = [
  { id: "residencial", label: "Residencial" },
  { id: "comercial", label: "Comercial" },
  { id: "industrial", label: "Industrial" },
  { id: "mixta", label: "Mixta" },
  { id: "campestre", label: "Campestre" },
  { id: "rural", label: "Rural" },
];

/* ============================================================
   COMPONENTE PRINCIPAL — FORMULARIO COLOMBIA v5.0
   ============================================================ */

export default function PropertyCharacteristicsForm() {
  const { formDataPropiedad, setFormDataPropiedad } = useAppContext();
  const { publicarDataAnuncio } = usePropiedades();
  const [loading, setLoading] = useState(false);

  // Catálogos cargados dinámicamente desde el backend
  const [operaciones, setOperaciones] = useState([]);
  const [tiposInmueble, setTiposInmueble] = useState([]);
  const [estadosConservacion, setEstadosConservacion] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState({});
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  // Características N:M seleccionadas (ids de feature_catalog)
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    let activo = true;
    Promise.all([
      apiBackend("/catalogos/operaciones"),
      apiBackend("/catalogos/tipos-inmueble"),
      apiBackend("/catalogos/estados"),
      apiBackend("/catalogos/caracteristicas"),
    ])
      .then(([ops, tipos, estados, feats]) => {
        if (!activo) return;
        setOperaciones(ops.success ? ops.data : []);
        setTiposInmueble(tipos.success ? tipos.data : []);
        setEstadosConservacion(estados.success ? estados.data : []);
        setCaracteristicas(feats.success ? feats.data : {});
      })
      .catch((err) => console.warn("⚠️ No se pudieron cargar catálogos:", err))
      .finally(() => {
        if (activo) setCargandoCatalogos(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Escribe un campo en formDataPropiedad
  const setCampo = (campo) => (valor) =>
    setFormDataPropiedad((prev) => ({ ...prev, [campo]: valor }));

  const toggleFeature = (id, checked) => {
    setFeatures((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  const onSubmit = (e) => {
    publicarDataAnuncio(e, setLoading, features);
    document.getElementById("top-detalles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const categorias = Object.keys(caracteristicas);

  return (
    <div className="flex max-w-2xl flex-col gap-10 font-montserrat">
      {/* ---- Datos generales ---- */}
      <div className="mt-6 flex flex-col gap-7">
        <Seccion titulo="Datos generales">
          <Campo label="Tipo de operación">
            <SimpleSelect
              options={operaciones.map((o) => ({
                id: o.id,
                label: o.label_es,
              }))}
              value={formDataPropiedad.operation_type_id || ""}
              onChange={setCampo("operation_type_id")}
            />
          </Campo>

          <Campo label="Tipo de inmueble">
            <SimpleSelect
              options={tiposInmueble.map((t) => ({
                id: t.id,
                label: t.label_es,
              }))}
              value={formDataPropiedad.property_type_id || ""}
              onChange={setCampo("property_type_id")}
            />
          </Campo>

          <Campo label="Estado de conservación">
            <SimpleSelect
              options={estadosConservacion.map((e) => ({
                id: e.id,
                label: e.label_es,
              }))}
              value={formDataPropiedad.condition_type_id || ""}
              onChange={setCampo("condition_type_id")}
            />
          </Campo>

          <Campo label="Estrato" descripcion="Estrato socioeconómico (1 al 6)">
            <SimpleSelect
              options={ESTRATOS.map((e) => ({ id: e, label: `Estrato ${e}` }))}
              value={formDataPropiedad.estrato || ""}
              onChange={setCampo("estrato")}
            />
          </Campo>

          <Campo label="Zona" descripcion="Uso del suelo predominante">
            <SimpleSelect
              options={ZONAS}
              value={formDataPropiedad.zona || ""}
              onChange={setCampo("zona")}
            />
          </Campo>
        </Seccion>
      </div>

      {/* ---- Áreas y distribución ---- */}
      <Seccion titulo="Áreas y distribución">
        <Campo label="Área construida (m²)">
          <UnitInput
            value={formDataPropiedad.constructed_area}
            onChange={setCampo("constructed_area")}
            unit="m²"
          />
        </Campo>

        <Campo label="Área privada (m²)" descripcion="Opcional">
          <UnitInput
            value={formDataPropiedad.private_area}
            onChange={setCampo("private_area")}
            unit="m²"
          />
        </Campo>

        <Campo label="Ambientes (habitaciones totales)">
          <NumberStepper
            value={formDataPropiedad.room_count}
            onChange={setCampo("room_count")}
          />
        </Campo>

        <Campo label="Alcobas">
          <NumberStepper
            value={formDataPropiedad.bedroom_count}
            onChange={setCampo("bedroom_count")}
          />
        </Campo>

        <Campo label="Baños completos">
          <NumberStepper
            value={formDataPropiedad.bathroom_count}
            onChange={setCampo("bathroom_count")}
          />
        </Campo>

        <Campo label="Baño social">
          <NumberStepper
            value={formDataPropiedad.social_bathroom_count}
            onChange={setCampo("social_bathroom_count")}
          />
        </Campo>
      </Seccion>

      {/* ---- Construcción ---- */}
      <Seccion titulo="Construcción">
        <Campo label="Año de construcción" descripcion="Opcional">
          <UnitInput
            value={formDataPropiedad.construction_year}
            onChange={setCampo("construction_year")}
            unit={null}
            placeholder="Ej: 2015"
          />
        </Campo>

        <Campo label="Piso" descripcion="Ej: 3, PH, Bajo">
          <UnitInput
            value={formDataPropiedad.floor}
            onChange={setCampo("floor")}
            unit={null}
            placeholder="Ej: 3"
          />
        </Campo>

        <Campo label="Número interior / apartamento" descripcion="Opcional">
          <UnitInput
            value={formDataPropiedad.interior_apartment_number}
            onChange={setCampo("interior_apartment_number")}
            unit={null}
            placeholder="Ej: 301, A"
          />
        </Campo>

        <CheckboxItem
          checked={!!formDataPropiedad.is_new_construction}
          onChange={setCampo("is_new_construction")}
          label="Es obra nueva / proyecto en preventa"
        />
      </Seccion>

      {/* ---- Parqueadero ---- */}
      <Seccion titulo="Parqueadero">
        <Campo label="Tipo de parqueadero">
          <SimpleSelect
            options={PARQUEADERO_TIPOS}
            value={formDataPropiedad.parqueadero_tipo || ""}
            onChange={setCampo("parqueadero_tipo")}
          />
        </Campo>

        <Campo label="Modo de parqueadero">
          <SimpleSelect
            options={PARQUEADERO_MODOS}
            value={formDataPropiedad.parqueadero_modo || ""}
            onChange={setCampo("parqueadero_modo")}
          />
        </Campo>

        <Campo label="Número de parqueaderos">
          <NumberStepper
            value={formDataPropiedad.parking_space_count}
            onChange={setCampo("parking_space_count")}
          />
        </Campo>

        <CheckboxItem
          checked={!!formDataPropiedad.parking_space_included}
          onChange={setCampo("parking_space_included")}
          label="Parqueadero incluido en el precio"
        />
      </Seccion>

      {/* ---- Servicios públicos ---- */}
      <Seccion titulo="Servicios públicos">
        <CheckboxItem
          checked={!!formDataPropiedad.tiene_agua}
          onChange={setCampo("tiene_agua")}
          label="Agua"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.tiene_luz}
          onChange={setCampo("tiene_luz")}
          label="Energía eléctrica"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.tiene_gas}
          onChange={setCampo("tiene_gas")}
          label="Gas natural"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.tiene_alcantarillado}
          onChange={setCampo("tiene_alcantarillado")}
          label="Alcantarillado"
        />
      </Seccion>

      {/* ---- Comodidades ---- */}
      <Seccion titulo="Comodidades">
        <CheckboxItem
          checked={!!formDataPropiedad.has_elevator}
          onChange={setCampo("has_elevator")}
          label="Ascensor"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.has_swimming_pool}
          onChange={setCampo("has_swimming_pool")}
          label="Piscina"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.has_gym}
          onChange={setCampo("has_gym")}
          label="Gimnasio"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.has_security_24h}
          onChange={setCampo("has_security_24h")}
          label="Seguridad 24 horas"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.has_air_conditioning}
          onChange={setCampo("has_air_conditioning")}
          label="Aire acondicionado"
        />
        <CheckboxItem
          checked={!!formDataPropiedad.is_furnished}
          onChange={setCampo("is_furnished")}
          label="Amoblado / Equipado"
        />
      </Seccion>

      {/* ---- Características N:M (feature_catalog) ---- */}
      <Seccion titulo="Características del inmueble">
        {cargandoCatalogos ? (
          <p className="text-sm text-slate-500">Cargando características…</p>
        ) : categorias.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay características disponibles.
          </p>
        ) : (
          categorias.map((categoria) => (
            <CheckboxGroup
              key={categoria}
              title={categoria}
              options={caracteristicas[categoria]}
              values={features}
              onToggle={toggleFeature}
            />
          ))
        )}
      </Seccion>

      {/* ---- Identificación catastral ---- */}
      <Seccion titulo="Identificación (opcional)">
        <Campo label="Cédula catastral">
          <UnitInput
            value={formDataPropiedad.cedula_catastral}
            onChange={setCampo("cedula_catastral")}
            unit={null}
          />
        </Campo>

        <Campo label="Matrícula inmobiliaria">
          <UnitInput
            value={formDataPropiedad.matricula_inmobiliaria}
            onChange={setCampo("matricula_inmobiliaria")}
            unit={null}
          />
        </Campo>
      </Seccion>

      {/* ---- Precio ---- */}
      <Seccion titulo="Precio del inmueble">
        <Campo label="Precio" descripcion="Precio en pesos colombianos (COP)">
          <UnitInput
            value={formDataPropiedad.precio || ""}
            onChange={setCampo("precio")}
            unit="COP"
          />
        </Campo>

        <Campo
          label="Administración"
          descripcion="Cuota mensual de administración (opcional)"
        >
          <UnitInput
            value={formDataPropiedad.administracion}
            onChange={setCampo("administracion")}
            unit="COP"
          />
        </Campo>
      </Seccion>

      {/* ---- Descripción del anuncio ---- */}
      <Seccion titulo="Descripción del anuncio">
        <InfoBanner>
          Los anuncios con comentarios racistas, homófobos y/o discriminatorios
          serán eliminados.
        </InfoBanner>

        <Campo label="Descripción">
          <Textarea
            value={formDataPropiedad.description || ""}
            onChange={(e) => setCampo("description")(e.target.value)}
            rows={5}
            placeholder="Describe el inmueble: zona, acabados, estado, cercanía a servicios…"
            className="block w-full resize-y rounded-md border border-slate-300 px-3 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
          />
        </Campo>

        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="w-full rounded-md bg-tercero px-6 py-3 text-base font-bold text-white hover:bg-tercero/80 active:scale-[0.99] cursor-pointer select-none disabled:opacity-50"
        >
          {loading ? "Publicando…" : "Continuar a fotos del anuncio"}
        </button>
      </Seccion>
    </div>
  );
}
