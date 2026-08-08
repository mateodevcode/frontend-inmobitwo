import Informacion from "@/pages/publicar-anuncio/informacion/Informacion";
import Dimensiones from "@/pages/publicar-anuncio/paso-2/components/Dimensiones";
import EstadoAntiguedad from "@/pages/publicar-anuncio/paso-2/components/EstadoAntiguedad";
import UbicacionFisica from "@/pages/publicar-anuncio/paso-2/components/UbicacionFisica";
import ParqueaderoServicios from "@/pages/publicar-anuncio/paso-2/components/ParqueaderoServicios";
import Caracteristicas from "@/pages/publicar-anuncio/paso-2/components/Caracteristicas";
import Documentacion from "@/pages/publicar-anuncio/paso-2/components/Documentacion";
import Precio from "@/pages/publicar-anuncio/paso-2/components/Precio";
import TituloDescripcion from "@/pages/publicar-anuncio/paso-2/components/TituloDescripcion";

const Detalles = () => {
  return (
    <div className="flex items-center md:items-start mb-40 md:flex-row flex-col">
      {/* FormData */}
      <div className="w-11/12 md:w-1/2 h-full text-black font-montserrat">
        <div className="flex flex-col mx-auto items-center md:items-start w-full md:w-120">
          <Dimensiones />
          <EstadoAntiguedad />
          <UbicacionFisica />
          <ParqueaderoServicios />
          <Caracteristicas />
          <Documentacion />
          <Precio />
          <TituloDescripcion />
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
