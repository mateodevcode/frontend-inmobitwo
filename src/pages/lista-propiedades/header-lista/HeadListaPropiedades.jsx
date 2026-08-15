import BreadcrumbUbicacion from "./BreadcrumbUbicacion";
import EncabezadoBusqueda from "./EncabezadoBusqueda";
import BotonGuardarBusqueda from "./BotonGuardarBusqueda";

const HeadListaPropiedades = ({ locationInfo }) => {
  return (
    <div className="w-[90%] 2xl:w-10/12 md:h-48 h-44 flex flex-col justify-between">
      <BreadcrumbUbicacion locationInfo={locationInfo} />

      <div className="w-full md:h-28 h-32 flex flex-col md:flex-row">
        <BotonGuardarBusqueda />
        <EncabezadoBusqueda locationInfo={locationInfo} />
      </div>
    </div>
  );
};

export default HeadListaPropiedades;
