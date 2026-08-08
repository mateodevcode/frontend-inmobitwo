import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import TipoSelect from "@/pages/publicar-anuncio/components/TipoSelect";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import { ZONAS } from "@/data/zonas";
import useDetalles from "@/hooks/useDetalles";

const UbicacionFisica = () => {
  const { formDataPropiedad, setCampo } = useDetalles();

  const zonaValue =
    ZONAS.find((z) => z.id === formDataPropiedad.zona) ?? null;

  return (
    <Bloque numero={3} titulo="Ubicación física">
      <div className="flex max-w-96 flex-col gap-6">
        <TipoSelect
          label="Zona"
          description="uso del suelo predominante"
          placeholder="Selecciona"
          options={ZONAS}
          value={zonaValue}
          onChange={(opt) => setCampo("zona")(opt?.id ?? "")}
        />

        <InputField
          label="Piso"
          description="ej: 3, PH, Bajo"
          value={formDataPropiedad.floor ?? ""}
          onChange={(e) => setCampo("floor")(e.target.value)}
          placeholder="Ej: 3, PH, Bajo"
        />

        <InputField
          label="Número interior / apartamento"
          value={formDataPropiedad.interior_apartment_number ?? ""}
          onChange={(e) => setCampo("interior_apartment_number")(e.target.value)}
          placeholder="Ej: 301, A"
        />
      </div>
    </Bloque>
  );
};

export default UbicacionFisica;
