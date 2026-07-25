import BreadcrumbUbicacion from "./BreadcrumbUbicacion";
import EncabezadoBusqueda from "./EncabezadoBusqueda";
import BotonGuardarBusqueda from "./BotonGuardarBusqueda";

const HeadListaPropiedades = ({ locationInfo }) => {
  return (
    <div className="w-[90%] 2xl:w-10/12 h-48 flex flex-col justify-between">
      <BreadcrumbUbicacion locationInfo={locationInfo} />

      <div className="w-full h-28 flex">
        <BotonGuardarBusqueda />
        <EncabezadoBusqueda locationInfo={locationInfo} />
      </div>
    </div>
  );
};

export default HeadListaPropiedades;
