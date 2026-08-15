import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import NavbarListaPropiedades from "./header-lista/NavbarListaPropiedades";
import ListadoDePropiedades from "./content/ListadoDePropiedades";
import HeadListaPropiedades from "./header-lista/HeadListaPropiedades";
import { useLocationInfo } from "@/hooks/useLocationInfo";
import { useSlugParser } from "@/hooks/useSlugParser";
import { apiBackend } from "@/api/apiBackend";
import { MAPPING_OPERACIONES, MAPPING_TIPOS } from "@/data/mappings_busqueda";
import SidebarListaPropiedades from "./sidebar/SidebarListaPropiedades";
import BarraNavegacionTauri from "../../components/barra-navegacion/BarraNavegacionTauri";

const ListaPropiedades = () => {
  const {
    operationSlug,
    typeSlug,
    citySlug,
    deptSlug,
    firstSegment,
    isSingleSegment,
    isCustomPolygon,
  } = useSlugParser();
  const [searchParams] = useSearchParams();
  const [polygonProps, setPolygonProps] = useState(null);
  const [polygonMissing, setPolygonMissing] = useState(false);

  const { locationInfo } = useLocationInfo(
    isCustomPolygon
      ? {
          operationSlug,
          typeSlug,
          citySlug: "",
          deptSlug: null,
          firstSegment,
          isSingleSegment: false,
        }
      : {
          operationSlug,
          typeSlug,
          citySlug,
          deptSlug,
          firstSegment,
          isSingleSegment,
        },
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchPolygonProps() {
      if (!isCustomPolygon) {
        if (!cancelled) {
          setPolygonProps(null);
          setPolygonMissing(false);
        }
        return;
      }
      const polyKey = searchParams.get("polyKey");
      if (!polyKey) {
        if (!cancelled) {
          setPolygonProps(null);
          setPolygonMissing(true);
        }
        return;
      }

      const geojsonStr = sessionStorage.getItem(polyKey);
      const op = sessionStorage.getItem(`${polyKey}_op`) || "venta";
      const tipo = sessionStorage.getItem(`${polyKey}_tipo`) || "viviendas";
      if (!geojsonStr) {
        if (!cancelled) {
          setPolygonProps(null);
          setPolygonMissing(true);
        }
        return;
      }

      const geojson = JSON.parse(geojsonStr);
      const operationDb = MAPPING_OPERACIONES[operationSlug] || op;
      const typeDb = MAPPING_TIPOS[typeSlug] || tipo;

      const res = await apiBackend("/api/inmuebles-en-poligono", "POST", {
        polygon: geojson,
        operation: operationDb,
        tipoInmueble: typeDb,
      });

      if (cancelled) return;

      if (res.success) {
        setPolygonMissing(false);
        setPolygonProps(res.data);
      } else {
        setPolygonProps(null);
        setPolygonMissing(true);
      }
    }

    fetchPolygonProps();

    return () => {
      cancelled = true;
    };
  }, [isCustomPolygon, searchParams, operationSlug, typeSlug]);

  const effectiveLocationInfo = isCustomPolygon
    ? { tipo: "custom_polygon", total_matching: polygonProps?.total || 0 }
    : locationInfo;

  return (
    <div className="flex items-center flex-col w-full font-poppins">
      <NavbarListaPropiedades />
      <HeadListaPropiedades locationInfo={effectiveLocationInfo} />
      <div className="w-full bg-gray-100">
        <div className="flex items-start w-full md:w-[90%] 2xl:w-10/12 mx-auto md:flex-row flex-col-reverse">
          <SidebarListaPropiedades
            locationInfo={effectiveLocationInfo}
            operationSlug={operationSlug}
            typeSlug={typeSlug}
          />
          <ListadoDePropiedades
            locationInfo={effectiveLocationInfo}
            operationSlug={operationSlug}
            typeSlug={typeSlug}
            polygonProps={polygonProps}
            polygonMissing={polygonMissing}
            isCustomPolygon={isCustomPolygon}
          />
        </div>
      </div>

      <BarraNavegacionTauri />
      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default ListaPropiedades;
