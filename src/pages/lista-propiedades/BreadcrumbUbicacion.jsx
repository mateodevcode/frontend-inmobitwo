import { MdArrowDropDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSlugParser } from "@/hooks/useSlugParser";

const BreadcrumbUbicacion = ({ locationInfo }) => {
  const { geoSegment, citySlug } = useSlugParser();

  return (
    <div className="flex items-center gap-2 mt-2 text-sm">
      <div className="text-blue-600">inmobitwo</div>

      {locationInfo?.tipo !== "region" && locationInfo?.region_name && (
        <>
          <MdOutlineKeyboardArrowRight />
          <div className="relative">
            <div className="text-blue-600">
              {locationInfo?.region_name}
            </div>
            <div className="absolute top-6">
              {locationInfo?.total_region?.toLocaleString() || ""}
            </div>
          </div>
        </>
      )}

      <MdOutlineKeyboardArrowRight />
      <div className="relative">
        <div className="text-blue-600">
          {locationInfo?.tipo === "region"
            ? locationInfo?.region_name
            : locationInfo?.state_name || geoSegment?.split("-").pop()}
        </div>
        <div className="absolute top-6">
          {locationInfo?.total_state_all?.toLocaleString() || ""}
        </div>
      </div>
      {locationInfo?.tipo === "ciudad" && (
        <>
          <MdOutlineKeyboardArrowRight />
          <div className="relative">
            <div className="text-segundo">
              {locationInfo?.city_name || citySlug}
            </div>
            <div className="absolute top-6">
              {locationInfo?.total_city?.toLocaleString() || ""}
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
