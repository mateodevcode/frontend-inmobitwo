import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import useDetalles from "@/hooks/useDetalles";

const Documentacion = () => {
  const { formDataPropiedad, setCampo } = useDetalles();

  return (
    <Bloque numero={6} titulo="Documentación (opcional)">
      <div className="flex max-w-96 flex-col gap-6">
        <InputField
          label="Cédula catastral"
          description="verificable ante el catastro"
          value={formDataPropiedad.cedula_catastral ?? ""}
          onChange={(e) => setCampo("cedula_catastral")(e.target.value)}
        />

        <InputField
          label="Matrícula inmobiliaria"
          description="registro público"
          value={formDataPropiedad.matricula_inmobiliaria ?? ""}
          onChange={(e) => setCampo("matricula_inmobiliaria")(e.target.value)}
        />
      </div>
    </Bloque>
  );
};

export default Documentacion;
