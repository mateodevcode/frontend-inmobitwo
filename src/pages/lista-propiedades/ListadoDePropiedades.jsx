import FiltroRelevante from "./FiltroRelevante";
import CardAnuncio from "./CardAnuncio";
import { useSlugParser } from "@/hooks/useSlugParser";
import { usePropertySearch } from "@/hooks/usePropertySearch";

const ListadoDePropiedades = () => {
  const { operationSlug, typeSlug, citySlug, deptSlug } = useSlugParser();
  const { properties, loading, error } = usePropertySearch({
    operationSlug,
    typeSlug,
    citySlug,
    deptSlug,
  });

  return (
    <div className="w-[75%] h-full">
      <FiltroRelevante />
      <div className="flex flex-col gap-4 p-4">
        {loading && (
          <div className="text-center py-20 text-gray-400 min-h-96 flex items-center justify-center">
            Cargando propiedades...
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-red-400">
            {error}
          </div>
        )}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No se encontraron inmuebles en esta zona.
          </div>
        )}
        {properties.map((propiedad) => (
          <CardAnuncio propiedad={propiedad} key={propiedad.id} />
        ))}
      </div>
    </div>
  );
};

export default ListadoDePropiedades;
