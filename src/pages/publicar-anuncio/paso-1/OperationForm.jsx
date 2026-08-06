import { useEffect, useState } from "react";
import { RadioGroup, Radio, Label, Description } from "@headlessui/react";
import { OPERATION_OPTIONS } from "@/data/operation_options";
import { RENTAL_TYPE_OPTIONS } from "@/data/rental_type_options";
import { useAppContext } from "@/context/AppContext";

// ---- Radio individual reutilizable ----
function RadioOption({ option, disabled = false }) {
  return (
    <Radio
      key={option.id}
      value={option}
      disabled={disabled}
      className="group flex cursor-pointer items-start gap-3 py-2 data-disabled:cursor-not-allowed data-disabled:opacity-40"
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 group-data-checked:border-tercero">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500 opacity-0 group-data-checked:opacity-100" />
      </span>
      <span>
        <Label
          as="p"
          className="text-base group-data-checked:text-tercero text-slate-900"
        >
          {option.label}
        </Label>
        {option.description && (
          <Description as="p" className="mt-0.5 text-sm text-slate-500">
            {option.description}
          </Description>
        )}
      </span>
    </Radio>
  );
}

// ---- Grupo "Operación" ----
function OperationField({
  value,
  onChange,
  options = OPERATION_OPTIONS,
  formDataPropiedad,
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-xl font-semibold text-slate-900">Operación</h2>
      <RadioGroup value={value} onChange={onChange} className="flex flex-col">
        {options.map((opt) => (
          <RadioOption
            key={opt.id}
            option={opt}
            disabled={
              formDataPropiedad.tipo === "habitacion" && opt.id === "venta"
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
}

// ---- Grupo "Tipo de alquiler" ----
function RentalTypeField({
  value,
  onChange,
  options = RENTAL_TYPE_OPTIONS,
  infoHref = "#",
}) {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold text-slate-900">
        Tipo de alquiler
      </h2>
      <a
        href={infoHref}
        className="mb-2 inline-block text-base text-blue-600 hover:underline"
      >
        Más información sobre tipos de alquiler
      </a>
      <RadioGroup value={value} onChange={onChange} className="flex flex-col">
        {options.map((opt) => (
          <RadioOption key={opt.id} option={opt} />
        ))}
      </RadioGroup>
    </div>
  );
}

// ---- Ejemplo de uso combinado ----
export default function OperationForm() {
  const [rentalType, setRentalType] = useState(RENTAL_TYPE_OPTIONS[0]);
  const { formDataPropiedad, setFormDataPropiedad } = useAppContext();

  useEffect(() => {
    if (
      formDataPropiedad.tipo === "habitacion" &&
      formDataPropiedad.operacion === "venta"
    ) {
      setFormDataPropiedad((prev) => ({ ...prev, operacion: "alquiler" }));
    }
  }, [formDataPropiedad.tipo]);

  return (
    <div className="flex max-w-xl flex-col gap-8 font-poppins md:mt-2">
      <OperationField
        value={
          OPERATION_OPTIONS.find(
            (opt) => opt.id === formDataPropiedad.operacion,
          ) ?? OPERATION_OPTIONS[0]
        }
        onChange={(selectedOption) => {
          const isVacacional = selectedOption.id === "alquiler-vacacional";
          setFormDataPropiedad({
            ...formDataPropiedad,
            operacion: isVacacional ? "alquiler" : selectedOption.id,
            tipo: isVacacional ? "vacacional" : formDataPropiedad.tipo,
          });
        }}
        formDataPropiedad={formDataPropiedad}
      />
      {(formDataPropiedad.operacion === "alquiler" ||
        formDataPropiedad.operacion === "alquiler-vacacional") && (
        <RentalTypeField value={rentalType} onChange={setRentalType} />
      )}
    </div>
  );
}

export { OperationField, RentalTypeField, RadioOption };
