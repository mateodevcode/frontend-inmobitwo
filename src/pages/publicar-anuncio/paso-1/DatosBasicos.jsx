import { useAppContext } from "@/context/AppContext";
import useDatosBasicos from "@/hooks/useDatosBasicos";
import LocationForm from "@/pages/publicar-anuncio/paso-1/LoactionForm";
import Informacion from "@/pages/publicar-anuncio/informacion/Informacion";
import ContactForm from "@/pages/publicar-anuncio/paso-1/ContactForm";
import TipoInmueble from "./components/TipoInmueble";
import CheckPublicarPorInmobiliaria from "./components/CheckPublicarPorInmobiliaria";
import Operacion from "./components/Operacion";
import TipoAlquiler from "./components/TipoAlquiler";

const DatosBasicos = () => {
  const { comprobarDireccion, formDataPropiedad } = useAppContext();
  const {
    propertyTypes,
    organizaciones,
    esDeOrganizacion,
    handleToggleOrganizacion,
    operacionValue,
    handleChangeOperacion,
    getOperacionDisabled,
    rentalTypeValue,
    handleChangeRentalType,
  } = useDatosBasicos();

  return (
    <div className="flex items-center md:items-start mb-40 md:flex-row flex-col">
      {/* FormData */}
      <div className="w-11/12 md:w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col w-full md:w-120 mx-auto">
          <TipoInmueble propertyTypes={propertyTypes} />

          {organizaciones.length > 0 && (
            <CheckPublicarPorInmobiliaria
              organizacionNombre={organizaciones[0]?.nombre}
              checked={esDeOrganizacion}
              onChange={handleToggleOrganizacion}
            />
          )}

          {/* Operación */}
          <Operacion
            value={operacionValue}
            onChange={handleChangeOperacion}
            getDisabled={getOperacionDisabled}
          />
          {(formDataPropiedad.operacion === "alquiler" ||
            formDataPropiedad.operacion === "alquiler-vacacional") && (
            <TipoAlquiler
              value={rentalTypeValue}
              onChange={handleChangeRentalType}
            />
          )}

          {/* Form localizacion */}
          <LocationForm />

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
