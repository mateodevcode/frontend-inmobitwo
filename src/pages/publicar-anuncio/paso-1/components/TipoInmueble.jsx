import TipoSelect from "../../components/TipoSelect";
import { useAppContext } from "@/context/AppContext";

const TipoInmueble = ({ propertyTypes }) => {
  const { formDataPropiedad, setFormDataPropiedad } = useAppContext();

  const selected =
    propertyTypes.find(
      (t) => String(t.id) === String(formDataPropiedad.property_type_id),
    ) ?? null;

  return (
    <>
      <h3 className="font-bold text-2xl md:text-2xl mt-6 md:mt-8">
        Pon tu anuncio aquí
      </h3>
      <div className="flex flex-col mt-6">
        <TipoSelect
          value={selected}
          onChange={(opt) => {
            setFormDataPropiedad((prev) => ({
              ...prev,
              property_type_id: opt?.id ?? "",
              tipo: opt?.code ?? "",
            }));
          }}
          options={propertyTypes}
        />
      </div>
    </>
  );
};

export default TipoInmueble;
