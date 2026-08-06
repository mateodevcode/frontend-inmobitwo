import Informacion from "@/pages/publicar-anuncio/informacion/Informacion";
import PropertyCharacteristicsForm from "@/pages/publicar-anuncio/paso-2/PropertyCharacteristicsForm";

const Detalles = () => {
  return (
    <div className="flex items-center md:items-start mb-40 md:flex-row flex-col">
      {/* FormData */}
      <div className="w-11/12 md:w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col mx-auto items-center md:items-start w-full md:w-150">
          <PropertyCharacteristicsForm />
        </div>
      </div>
      {/* Informativo */}
      <div className="w-full md:w-1/2 h-full">
        <Informacion />
      </div>
    </div>
  );
};

export default Detalles;
