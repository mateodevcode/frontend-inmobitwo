import Informacion from "./components/Informacion";
import PropertyCharacteristicsForm from "@/components/publicar-anuncio/components/PropertyCharacteristicsForm";

const Detalles = () => {
  return (
    <div className="flex items-start mb-40">
      {/* FormData */}
      <div className="w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col w-120 mx-auto">
          <PropertyCharacteristicsForm />
        </div>
      </div>
      {/* Informativo */}
      <div className="w-1/2 h-full">
        <Informacion />
      </div>
    </div>
  );
};

export default Detalles;
