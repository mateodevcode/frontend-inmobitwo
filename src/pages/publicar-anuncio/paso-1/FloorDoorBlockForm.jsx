import { useState } from "react";
import {
  Field,
  Label,
  Checkbox,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  RadioGroup,
  Radio,
  Input,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

const FLOOR_OPTIONS = [
  { id: "bajo", label: "Bajo" },
  { id: "entresuelo", label: "Entresuelo" },
  { id: "1", label: "1ª planta" },
  { id: "2", label: "2ª planta" },
  { id: "3", label: "3ª planta" },
  { id: "4", label: "4ª planta" },
  { id: "5", label: "5ª planta o superior" },
];

const DOOR_OPTIONS = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
  { id: "d", label: "D" },
  { id: "izq", label: "Izquierda" },
  { id: "der", label: "Derecha" },
];

const BLOCK_OPTIONS = [
  { id: "no", label: "No" },
  { id: "si", label: "Sí, bloque/portal:" },
];

// ---- Reutilizable: select simple tipo "Selecciona" ----
function SimpleSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona",
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`flex w-full items-center justify-between rounded-md border bg-white px-4 py-3 text-left text-base text-slate-900 focus:outline-none ${
              open
                ? "border-tercero"
                : "border-slate-300 hover:border-tercero/80"
            }`}
          >
            <span>{value ? value.label : placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-700" />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            transition
            className="z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg [--anchor-gap:4px] w-(--button-width)] transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt}
                className="group flex cursor-pointer items-center justify-between px-4 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
              >
                <span>{opt.label}</span>
                <Check className="h-4 w-4 shrink-0 text-slate-900 opacity-0 group-data-selected:opacity-100" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}

// ---- Reutilizable: checkbox con label ----
function CheckboxField({ checked, onChange, label }) {
  return (
    <Field className="flex items-center gap-2.5">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="group flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-400 bg-white data-checked:border-slate-900 data-checked:bg-slate-900"
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
      <Label className="text-base text-slate-900">{label}</Label>
    </Field>
  );
}

export default function FloorDoorBlockForm() {
  const [lastFloor, setLastFloor] = useState(false);
  const [floor, setFloor] = useState(null);
  const [door, setDoor] = useState(null);
  const [block, setBlock] = useState(BLOCK_OPTIONS[0]); // "No" preseleccionado
  const [blockValue, setBlockValue] = useState("");

  return (
    <div className="flex max-w-xl flex-col gap-6 mt-10 font-poppins">
      {/* Planta */}
      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Planta
        </Label>
        <SimpleSelect
          options={FLOOR_OPTIONS}
          value={floor}
          onChange={setFloor}
        />
      </Field>

      <CheckboxField
        checked={lastFloor}
        onChange={setLastFloor}
        label="Es la última planta del bloque"
      />

      {/* Puerta */}
      <Field>
        <Label className="mb-2 block text-lg font-semibold text-slate-900">
          Puerta
        </Label>
        <SimpleSelect options={DOOR_OPTIONS} value={door} onChange={setDoor} />
        <p className="mt-2 text-sm text-slate-500">
          No mostraremos la puerta en tu anuncio
        </p>
      </Field>

      {/* ¿Hay más de un bloque/portal? */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">
          ¿Hay más de un bloque/portal?
        </h3>
        <RadioGroup
          value={block}
          onChange={setBlock}
          className="flex flex-col gap-3"
        >
          {BLOCK_OPTIONS.map((opt) => (
            <Radio
              key={opt.id}
              value={opt}
              className="group flex cursor-pointer items-center gap-3"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 group-data-checked:border-slate-900">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-900 opacity-0 group-data-checked:opacity-100" />
              </span>
              <span className="text-base text-slate-900">{opt.label}</span>

              {opt.id === "si" && (
                <Input
                  value={blockValue}
                  onChange={(e) => setBlockValue(e.target.value)}
                  disabled={block?.id !== "si"}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-2 w-40 rounded-md border border-slate-300 px-3 py-2 text-base text-slate-900 disabled:bg-slate-50 disabled:text-slate-400 focus:border-slate-900 focus:outline-none"
                />
              )}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
