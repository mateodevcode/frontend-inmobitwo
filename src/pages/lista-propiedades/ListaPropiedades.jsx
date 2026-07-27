import FiltrosPrincipal from "./FiltrosPrincipal";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import NavbarListaPropiedades from "./NavbarListaPropiedades";
import ListadoDePropiedades from "./ListadoDePropiedades";
import HeadListaPropiedades from "./HeadListaPropiedades";
import { useLocationInfo } from "@/hooks/useLocationInfo";
import { useSlugParser } from "@/hooks/useSlugParser";

const ListaPropiedades = () => {
  const { operationSlug, typeSlug, citySlug, deptSlug, firstSegment, isSingleSegment } = useSlugParser();
  const { locationInfo } = useLocationInfo({ operationSlug, typeSlug, citySlug, deptSlug, firstSegment, isSingleSegment });

  return (
    <div className="flex items-center flex-col w-full font-poppins">
      <NavbarListaPropiedades />
      <HeadListaPropiedades locationInfo={locationInfo} />

      <div className="w-full bg-gray-100">
        <div className="flex items-start w-[90%] 2xl:w-10/12 mx-auto">
          <FiltrosPrincipal locationInfo={locationInfo} operationSlug={operationSlug} typeSlug={typeSlug} />
          <ListadoDePropiedades locationInfo={locationInfo} operationSlug={operationSlug} typeSlug={typeSlug} />
        </div>
      </div>

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default ListaPropiedades;
