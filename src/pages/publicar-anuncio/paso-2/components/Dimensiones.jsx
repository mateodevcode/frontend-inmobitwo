import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import NumberStepper from "@/pages/publicar-anuncio/components/NumberStepper";
import TipoSelect from "@/pages/publicar-anuncio/components/TipoSelect";
import { ESTRATOS } from "@/data/estratos";
import useDetalles from "@/hooks/useDetalles";

const Dimensiones = () => {
  const { formDataPropiedad, setCampo } = useDetalles();

  const estratoValue =
    ESTRATOS.find((e) => String(e.id) === String(formDataPropiedad.estrato)) ??
    null;

  // El área de lote/terreno solo aplica a inmuebles con terreno
  const tiposConLote = ["lote", "casa_lote", "finca"];
  const esConLote = tiposConLote.includes(formDataPropiedad.tipo);

  return (
    <Bloque numero={1} titulo="Características generales" defaultOpen>
      <div className="flex max-w-96 flex-col gap-6">
        <TipoSelect
          label="Estrato"
          placeholder="Selecciona"
          options={ESTRATOS}
          value={estratoValue}
          onChange={(opt) => setCampo("estrato")(opt?.id ?? "")}
        />

        <InputField
          label="Área privada (m²)"
          value={formDataPropiedad.private_area ?? ""}
          onChange={(e) => setCampo("private_area")(e.target.value)}
          unit="m²"
          numeric
        />

        <InputField
          label="Área construida (m²)"
          value={formDataPropiedad.constructed_area ?? ""}
          onChange={(e) => setCampo("constructed_area")(e.target.value)}
          unit="m²"
          numeric
        />

        {esConLote && (
          <InputField
            label="Área de lote / terreno (m²)"
            description="para casas, fincas o lotes (opcional)"
            value={formDataPropiedad.plot_area ?? ""}
            onChange={(e) => setCampo("plot_area")(e.target.value)}
            unit="m²"
            numeric
          />
        )}

        <NumberStepper
          label="Ambientes"
          description="sala, comedor, estudio..."
          value={formDataPropiedad.room_count}
          onChange={setCampo("room_count")}
        />
        <NumberStepper
          label="Alcobas"
          description="dormitorios"
          value={formDataPropiedad.bedroom_count}
          onChange={setCampo("bedroom_count")}
        />
        <NumberStepper
          label="Baños completos"
          description="con ducha"
          value={formDataPropiedad.bathroom_count}
          onChange={setCampo("bathroom_count")}
        />
        <NumberStepper
          label="Baño social"
          description="sin ducha, para visitas"
          value={formDataPropiedad.social_bathroom_count}
          onChange={setCampo("social_bathroom_count")}
        />
      </div>
    </Bloque>
  );
};

export default Dimensiones;
