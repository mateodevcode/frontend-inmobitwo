// src/features/seleccionar-zona/components/MiniMapaUbicacion.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiBackend } from "@/api/apiBackend.js";
import { BsFillGeoAltFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { VITE_MAPTILER_KEY } from "../../../config/config";

export default function MiniMapaUbicacion({
  locationInfo,
  operationSlug,
  typeSlug,
}) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const layerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!locationInfo) return;

    async function init() {
      if (instanceRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });

      L.tileLayer(
        `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${VITE_MAPTILER_KEY}`,
        {
          attribution: "",
          maxZoom: 20,
          tileSize: 512,
          zoomOffset: -1, // importante: sin esto se ve borroso/mal alineado
        },
      ).addTo(map);

      instanceRef.current = map;

      // Determinar qué pedir al backend
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

        if (layerRef.current) map.removeLayer(layerRef.current);

        // Para regiones usamos bounds, para ciudad/depto usamos geometría
        if (res.data.geometry) {
          layerRef.current = L.geoJSON(res.data.geometry, {
            style: {
              color: "#e6007a",
              weight: 2,
              fillColor: "#e6007a",
              fillOpacity: 0.35,
            },
          }).addTo(map);
          map.fitBounds(layerRef.current.getBounds(), { padding: [10, 10] });
        } else if (res.data.bounds) {
          map.fitBounds(res.data.bounds, { padding: [10, 10] });
        }
      } catch (e) {
        console.error("Error cargando geometría de ubicación:", e);
      }
    }

    init();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
        layerRef.current = null;
      }
    };
  }, [locationInfo]);

  const handleVerEnMapa = () => {
    const op = operationSlug || "venta";
    const tipo = typeSlug || "viviendas";
    navigate(`/busqueda-multizona/${op}-${tipo}`);
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
