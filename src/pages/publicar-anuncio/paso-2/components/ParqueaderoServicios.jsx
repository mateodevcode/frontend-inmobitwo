import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import RadioGroupInput from "@/pages/publicar-anuncio/components/RadioGroupInput";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import NumberStepper from "@/pages/publicar-anuncio/components/NumberStepper";
import CheckBoxUnico from "@/pages/publicar-anuncio/components/CheckBoxUnico";
import { PARQUEADERO_TIPOS, PARQUEADERO_MODOS } from "@/data/parqueadero";
import useDetalles from "@/hooks/useDetalles";

const ParqueaderoServicios = () => {
  const { formDataPropiedad, setCampo } = useDetalles();

  const parqTipoValue =
    PARQUEADERO_TIPOS.find((o) => o.id === formDataPropiedad.parqueadero_tipo) ??
    null;
  const parqModoValue =
    PARQUEADERO_MODOS.find((o) => o.id === formDataPropiedad.parqueadero_modo) ??
    null;

  return (
    <Bloque numero={4} titulo="Parqueadero y servicios">
      <div className="flex max-w-96 flex-col gap-6">
        <RadioGroupInput
          label="Tipo de parqueadero"
          options={PARQUEADERO_TIPOS}
          value={parqTipoValue}
          onChange={(opt) => setCampo("parqueadero_tipo")(opt.id)}
        />

        <RadioGroupInput
          label="Modo de parqueadero"
          options={PARQUEADERO_MODOS}
          value={parqModoValue}
          onChange={(opt) => setCampo("parqueadero_modo")(opt.id)}
        />

        <NumberStepper
          label="Número de parqueaderos"
          value={formDataPropiedad.parking_space_count}
          onChange={setCampo("parking_space_count")}
        />

        <CheckBoxUnico
          checked={!!formDataPropiedad.parking_space_included}
          onChange={(c) => setCampo("parking_space_included")(c)}
          label="Parqueadero incluido en el precio"
        />

        <InputField
          label="Precio del parqueadero"
          description="si no va incluido"
          value={formDataPropiedad.parking_space_price ?? ""}
          onChange={(e) => setCampo("parking_space_price")(e.target.value)}
          unit="COP"
          numeric
        />

        <InputField
          label="Administración"
          description="cuota mensual del conjunto (opcional)"
          value={formDataPropiedad.administracion ?? ""}
          onChange={(e) => setCampo("administracion")(e.target.value)}
          unit="COP"
          numeric
        />

        <div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            Servicios públicos
          </h3>
          <CheckBoxUnico
            checked={!!formDataPropiedad.tiene_agua}
            onChange={(c) => setCampo("tiene_agua")(c)}
            label="Agua"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.tiene_luz}
            onChange={(c) => setCampo("tiene_luz")(c)}
            label="Energía eléctrica"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.tiene_gas}
            onChange={(c) => setCampo("tiene_gas")(c)}
            label="Gas natural"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.tiene_alcantarillado}
            onChange={(c) => setCampo("tiene_alcantarillado")(c)}
            label="Alcantarillado"
          />
        </div>
      </div>
    </Bloque>
  );
};

export default ParqueaderoServicios;
