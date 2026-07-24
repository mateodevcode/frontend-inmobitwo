import { Link } from "react-router-dom";
import { MdArrowDropDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSlugParser } from "@/hooks/useSlugParser";

const BreadcrumbUbicacion = ({ locationInfo }) => {
  const { geoSegment, citySlug, firstSegment } = useSlugParser();

  if (!locationInfo) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm">
        <Link to="/" className="text-blue-600 hover:underline">
          inmobitwo
        </Link>
        <MdOutlineKeyboardArrowRight />
        <div className="text-black">{geoSegment?.split("-").pop() || ""}</div>
        <div>
          <MdArrowDropDown />
        </div>
      </div>
    );
  }

  const esRegion = locationInfo.tipo === "region";
  const esDepto = locationInfo.tipo === "departamento";
  const esCiudad = locationInfo.tipo === "ciudad";
  const tieneRegion = !esRegion && locationInfo.region_name;

  return (
    <div className="flex items-center gap-2 mt-2 text-sm">
      <Link to="/" className="text-blue-600 hover:underline">
        inmobitwo
      </Link>

      {tieneRegion && (
        <>
          <MdOutlineKeyboardArrowRight />
          <Link
            to={`/${firstSegment}/${locationInfo.region_slug}`}
            className="relative"
          >
            <div className="text-blue-600 hover:underline">
              {locationInfo.region_name}
            </div>
            <div className="absolute top-6 text-black no-underline">
              {locationInfo.total_region?.toLocaleString() || ""}
            </div>
          </Link>
        </>
      )}

      <MdOutlineKeyboardArrowRight />
      {esDepto || esRegion ? (
        <div className="relative">
          <div className="text-black">
            {esRegion
              ? locationInfo.region_name
              : locationInfo.state_name || geoSegment?.split("-").pop()}
          </div>
          <div className="absolute top-6 text-black">
            {locationInfo.total_state_all?.toLocaleString() || ""}
          </div>
        </div>
      ) : (
        <Link
          to={`/${firstSegment}/${locationInfo.state_slug}`}
          className="relative"
        >
          <div className="text-blue-600 hover:underline">
            {locationInfo.state_name || geoSegment?.split("-").pop()}
          </div>
          <div className="absolute top-6 text-black no-underline">
            {locationInfo.total_state_all?.toLocaleString() || ""}
          </div>
        </Link>
      )}

      {esCiudad && (
        <>
          <MdOutlineKeyboardArrowRight />
          <div className="relative">
            <div className="text-black">
              {locationInfo.city_name || citySlug}
            </div>
            <div className="absolute top-6 text-black">
              {locationInfo.total_city?.toLocaleString() || ""}
            </div>
          </div>
        </>
      )}
      <div>
        <MdArrowDropDown />
      </div>
    </div>
  );
};

export default BreadcrumbUbicacion;
