import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VITE_MAPTILER_KEY } from "@/config/config.js";

export default function UbicacionMapa({ lat, lng }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      center: [lat, lng],
      zoom: 15,
    });

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${VITE_MAPTILER_KEY}`,
      { attribution: "", maxZoom: 20, tileSize: 512, zoomOffset: -1 },
    ).addTo(map);

    const icon = L.divIcon({
      html: `<div class="price-pin-simple"></div>`,
      className: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker([lat, lng], { icon }).addTo(map);

    instanceRef.current = map;

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [lat, lng]);

  const handleAmpliar = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <div>
      <div
        ref={mapRef}
        className="w-full h-64 rounded-sm border border-gray-200"
      />
      <button
        onClick={handleAmpliar}
        className="text-sm font-semibold text-blue-600 hover:underline mt-2"
      >
        🔍 Ampliar mapa
      </button>
    </div>
  );
}
