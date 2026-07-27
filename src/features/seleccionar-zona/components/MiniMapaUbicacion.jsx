// src/features/seleccionar-zona/components/MiniMapaUbicacion.jsx
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { apiBackend } from "@/api/apiBackend.js";
import { BsFillGeoAltFill } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

export default function MiniMapaUbicacion({
  locationInfo,
  operationSlug,
  typeSlug,
}) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!locationInfo) return;

    async function init() {
      if (instanceRef.current) return;

      const map = new maplibregl.Map({
        container: mapRef.current,
        style: {
          version: 8,
          sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } },
          layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
        },
        interactive: false,
        attributionControl: false,
      });

      instanceRef.current = map;

      map.on("load", async () => {
        const { tipo } = locationInfo;
        let endpoint = "";

        if (tipo === "ciudad") {
          const { city_slug, state_slug } = locationInfo;
          if (city_slug && state_slug) {
            endpoint = `/api/location-geojson?tipo=ciudad&city=${city_slug}&dept=${state_slug}`;
          }
        } else if (tipo === "departamento") {
          const { state_slug } = locationInfo;
          if (state_slug) {
            endpoint = `/api/location-geojson?tipo=departamento&dept=${state_slug}`;
          }
        } else if (tipo === "region") {
          const { region_slug } = locationInfo;
          if (region_slug) {
            endpoint = `/api/location-geojson?tipo=region&region=${region_slug}`;
          }
        }

        if (!endpoint) return;

        try {
          const res = await apiBackend(endpoint);
          if (!res.success || !res.data) return;

          if (res.data.geometry) {
            map.addSource("zonaboundary", {
              type: "geojson",
              data: { type: "Feature", geometry: res.data.geometry, properties: {} },
            });
            map.addLayer({
              id: "zona-fill",
              type: "fill",
              source: "zonaboundary",
              paint: {
                "fill-color": "#e6007a",
                "fill-opacity": 0.35,
              },
            });
            map.addLayer({
              id: "zona-line",
              type: "line",
              source: "zonaboundary",
              paint: {
                "line-color": "#e6007a",
                "line-width": 2,
              },
            });

            const coords = extractCoords(res.data.geometry);
            if (coords.length > 0) {
              const bounds = coords.reduce(
                (b, [lng, lat]) => {
                  return [
                    [Math.min(b[0][0], lng), Math.min(b[0][1], lat)],
                    [Math.max(b[1][0], lng), Math.max(b[1][1], lat)],
                  ];
                },
                [
                  [Infinity, Infinity],
                  [-Infinity, -Infinity],
                ],
              );
              map.fitBounds(bounds, { padding: 10 });
            }
          } else if (res.data.bounds) {
            map.fitBounds(res.data.bounds, { padding: 10 });
          }
        } catch (e) {
          console.error("Error cargando geometria de ubicacion:", e);
        }
      });
    }

    init();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [locationInfo]);

  const handleVerEnMapa = () => {
    navigate(`${location.pathname}/mapa`);
  };

  return (
    <div className="w-full h-60 2xl:h-80 flex flex-col">
      <div className="w-full h-full border border-black/40 border-b-transparent rounded-sm">
        <div ref={mapRef} className="w-full h-full rounded-sm" />
      </div>
      <div
        className="w-full h-14 border border-black/40 text-black flex items-center gap-2 justify-center font-semibold cursor-pointer select-none hover:bg-black/5"
        onClick={handleVerEnMapa}
      >
        <BsFillGeoAltFill />
        <p>Ver en mapa</p>
      </div>
    </div>
  );
}

function extractCoords(geometry) {
  if (!geometry) return [];
  const type = geometry.type;
  if (type === "Point") return [geometry.coordinates];
  if (type === "MultiPoint" || type === "LineString")
    return geometry.coordinates;
  if (type === "MultiLineString" || type === "Polygon")
    return geometry.coordinates.flat();
  if (type === "MultiPolygon")
    return geometry.coordinates.flat(2);
  if (type === "GeometryCollection")
    return geometry.geometries.flatMap(extractCoords);
  return [];
}
