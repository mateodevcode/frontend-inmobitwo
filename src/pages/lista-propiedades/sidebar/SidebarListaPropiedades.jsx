import MiniMapaUbicacion from "@/pages/seleccionar-zona/components/MiniMapaUbicacion";
import FormFiltros from "./filtros/FormFiltros";

const SidebarListaPropiedades = ({ locationInfo, operationSlug, typeSlug }) => {
  return (
    <div className="w-full md:w-[25%] h-full bg-primero p-6">
      <MiniMapaUbicacion
        locationInfo={locationInfo}
        operationSlug={operationSlug}
        typeSlug={typeSlug}
      />
      <FormFiltros operationSlug={operationSlug} typeSlug={typeSlug} />
    </div>
  );
};

export default SidebarListaPropiedades;
