import { useLocation } from "react-router-dom";

export function useSlugParser() {
  const { pathname } = useLocation();
  const [firstSegment, geoSegment] = pathname.split("/").filter(Boolean);

  let operationSlug = "venta";
  let typeSlug = "viviendas";

  if (firstSegment) {
    const dashIndex = firstSegment.indexOf("-");
    if (dashIndex !== -1) {
      operationSlug = firstSegment.slice(0, dashIndex);
      typeSlug = firstSegment.slice(dashIndex + 1);
    } else {
      operationSlug = firstSegment;
    }
  }

  let citySlug = "";
  let deptSlug = "";
  let isSingleSegment = false;

  if (geoSegment) {
    const geoParts = geoSegment.split("-");
    if (geoParts.length === 1) {
      isSingleSegment = true;
      deptSlug = geoParts[0];
    } else {
      deptSlug = geoParts.pop();
      citySlug = geoParts.join("-");
    }
  }

  return {
    operationSlug,
    typeSlug,
    citySlug,
    deptSlug,
    geoSegment,
    firstSegment,
    isSingleSegment,
  };
}
