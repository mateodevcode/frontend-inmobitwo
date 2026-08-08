import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import RadioGroupInput from "@/pages/publicar-anuncio/components/RadioGroupInput";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import NumberStepper from "@/pages/publicar-anuncio/components/NumberStepper";
import CheckBoxUnico from "@/pages/publicar-anuncio/components/CheckBoxUnico";
import useDetalles from "@/hooks/useDetalles";

const EstadoAntiguedad = () => {
  const {
    formDataPropiedad,
    setCampo,
    conditionTypes,
    handleYearChange,
    handleAntiguedadChange,
  } = useDetalles();

  const conditionOptions = conditionTypes.map((c) => ({
    id: c.id,
    label: c.label_es,
  }));

  const conditionValue =
    conditionOptions.find(
      (o) => String(o.id) === String(formDataPropiedad.condition_type_id),
    ) ?? null;

  return (
    <Bloque numero={2} titulo="Estado y antigüedad">
      <div className="flex max-w-96 flex-col gap-6">
        <RadioGroupInput
          label="Estado de conservación"
          options={conditionOptions}
          value={conditionValue}
          onChange={(opt) => setCampo("condition_type_id")(opt.id)}
        />

        <InputField
          label="Año de construcción"
          value={formDataPropiedad.construction_year ?? ""}
          onChange={handleYearChange}
          placeholder="Ej: 2015"
          numeric
        />

        <NumberStepper
          label="Antigüedad"
          description="años desde su construcción (se calcula el año automáticamente)"
          value={formDataPropiedad.antiguedad_anios}
          onChange={handleAntiguedadChange}
        />

        <CheckBoxUnico
          checked={!!formDataPropiedad.is_new_construction}
          onChange={(checked) => setCampo("is_new_construction")(checked)}
          label="Es obra nueva / proyecto en preventa"
        />
      </div>
    </Bloque>
  );
};

export default EstadoAntiguedad;
