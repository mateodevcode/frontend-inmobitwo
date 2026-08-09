import TipoInmueble from "./TipoInmueble";
import Precio from "./Precio";
import Tamano from "./Tamano";
import TipoVivienda from "./TipoVivienda";
import TipoAlquiler from "./TipoAlquiler";
import Alcobas from "./Alcobas";
import Banos from "./Banos";
import Estado from "./Estado";
import Caracteristicas from "./Caracteristicas";
import TipoAnunciante from "./TipoAnunciante";
import Multimedia from "./Multimedia";
import FechaPublicacion from "./FechaPublicacion";

const FormFiltros = ({ operationSlug, typeSlug }) => {
  return (
    <div className="w-full h-full overflow-y-auto py-5 font-poppins">
      {/* Tipo de inmueble */}
      <TipoInmueble operationSlug={operationSlug} typeSlug={typeSlug} />

      {/* Precio */}
      <Precio operationSlug={operationSlug} />

      {/* Tamaño */}
      <Tamano />

      {/* Tipo de alquiler (solo en alquiler) */}
      <TipoAlquiler operationSlug={operationSlug} />

      {/* Tipo de vivienda (agrupado) */}
      <TipoVivienda operationSlug={operationSlug} />

      {/* Alcobas */}
      <Alcobas />

      {/* Baños */}
      <Banos />

      {/* Estado */}
      <Estado />

      {/* Características */}
      <Caracteristicas />

      {/* Multimedia */}
      <Multimedia />

      {/* Tipo de anunciante */}
      <TipoAnunciante />

      {/* Fecha de publicación */}
      <FechaPublicacion />
    </div>
  );
};

export default FormFiltros;
