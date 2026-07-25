import MiniMapaUbicacion from "@/features/seleccionar-zona/components/MiniMapaUbicacion";
import FormFiltros from "./FormFiltros";

const FiltrosPrincipal = ({ locationInfo, operationSlug, typeSlug }) => {
  return (
    <div className="w-[25%] h-full bg-primero p-6">
      <MiniMapaUbicacion
        locationInfo={locationInfo}
        operationSlug={operationSlug}
        typeSlug={typeSlug}
      />
      <FormFiltros />
    </div>
  );
};

export default FiltrosPrincipal;
