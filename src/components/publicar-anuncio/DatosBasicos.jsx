import { useState } from "react";
import TipoSelect from "./components/TipoSelect";
import { PROPERTY_TYPES } from "@/data/property_types";
import OperationForm from "@/components/publicar-anuncio/components/OperationForm";
import LocationForm from "@/components/publicar-anuncio/components/LoactionForm";
import Informacion from "@/components/publicar-anuncio/components/Informacion";
import FloorDoorBlockForm from "@/components/publicar-anuncio/components/FloorDoorBlockForm";
import ContactForm from "@/components/publicar-anuncio/components/ContactForm";
import { useAppContext } from "@/context/AppContext";

const DatosBasicos = () => {
  const [selected, setSelected] = useState(null);
  const { comprobarDireccion } = useAppContext();

  return (
    <div className="flex items-start mb-40">
      {/* FormData */}
      <div className="w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col w-120 mx-auto">
          <h3 className="font-bold text-4xl mt-8">Pon tu anuncio aquí</h3>
          <div className="flex flex-col mt-6">
            <TipoSelect
              value={selected}
              onChange={setSelected}
              options={PROPERTY_TYPES}
            />
          </div>

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
      <div className="w-1/2 h-full">
        <Informacion />
      </div>
    </div>
  );
};

export default DatosBasicos;
