import { useEffect, useState } from "react";
import TipoSelect from "@/pages/publicar-anuncio/paso-1/TipoSelect";
import { PROPERTY_TYPES } from "@/data/property_types";
import OperationForm from "@/pages/publicar-anuncio/paso-1/OperationForm";
import LocationForm from "@/pages/publicar-anuncio/paso-1/LoactionForm";
import Informacion from "@/pages/publicar-anuncio/informacion/Informacion";
import FloorDoorBlockForm from "@/pages/publicar-anuncio/paso-1/FloorDoorBlockForm";
import ContactForm from "@/pages/publicar-anuncio/paso-1/ContactForm";
import { useAppContext } from "@/context/AppContext";
import useOrganizaciones from "@/hooks/useOrganizaciones";

const DatosBasicos = () => {
  const [selected, setSelected] = useState(null);
  const {
    comprobarDireccion,
    organizaciones,
    formDataPropiedad,
    setFormDataPropiedad,
  } = useAppContext();

  const esDeOrganizacion = !!formDataPropiedad?.es_de_organizacion;

  const { cargarMisOrganizaciones } = useOrganizaciones();

  useEffect(() => {
    cargarMisOrganizaciones();
  }, []);

  const handleToggleOrganizacion = (checked) => {
    setFormDataPropiedad((prev) => ({
      ...prev,
      es_de_organizacion: checked,
      organizacion_id: checked ? (organizaciones[0]?.id ?? null) : null,
    }));
  };

  return (
    <div className="flex items-center md:items-start mb-40 md:flex-row flex-col">
      {/* FormData */}
      <div className="w-11/12 md:w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col w-full md:w-120 mx-auto">
          <h3 className="font-bold text-2xl md:text-2xl mt-6 md:mt-8">
            Pon tu anuncio aquí
          </h3>
          <div className="flex flex-col mt-6">
            <TipoSelect
              value={selected}
              onChange={setSelected}
              options={PROPERTY_TYPES}
            />
          </div>

          {organizaciones.length > 0 && (
            <label className="flex items-center gap-3 mt-4 p-3 rounded-lg border border-black/10 cursor-pointer select-none hover:bg-stone-50 w-full">
              <input
                type="checkbox"
                checked={esDeOrganizacion}
                onChange={(e) => handleToggleOrganizacion(e.target.checked)}
                className="w-4 h-4 accent-rose-600"
              />
              <div>
                <p className="text-sm font-medium">
                  Publicar como {organizaciones[0]?.nombre}
                </p>
                <p className="text-xs text-black/50">
                  El anuncio aparecerá bajo el sello de tu inmobiliaria en vez
                  de a título personal
                </p>
              </div>
            </label>
          )}

          {/* Checkboxs */}
          <OperationForm />

          {/* Form localizacion */}
          <LocationForm />

          {/* Informacion del piso */}
          {comprobarDireccion && <FloorDoorBlockForm />}

          {/* Formulario de contacto */}
          {comprobarDireccion && <ContactForm />}
        </div>
      </div>
      {/* Informativo */}
      <div className="w-full md:w-1/2 h-full">
        <Informacion />
      </div>
    </div>
  );
};

export default DatosBasicos;
