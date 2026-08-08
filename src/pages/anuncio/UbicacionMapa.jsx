import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { BsArrowsAngleExpand } from "react-icons/bs";

export default function UbicacionMapa({ lat, lng }) {
  const mapContainerRef = useRef(null);
  const instanceRef = useRef(null);
  const coordsRef = useRef({ lat, lng });

  useEffect(() => {
    coordsRef.current = { lat, lng };
  }, [lat, lng]);

  useEffect(() => {
    if (!lat || !lng || instanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
      },
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    const el = document.createElement("div");
    el.innerHTML = `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.6 12.5 27 12.5 27s12.5-18.4 12.5-27C25 5.6 19.4 0 12.5 0z" fill="#FF1B1C"/><circle cx="12.5" cy="12.5" r="5" fill="white"/></svg>`;

    new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([lng, lat])
      .addTo(map);

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

  const handleCentrar = () => {
    const map = instanceRef.current;
    const c = coordsRef.current;
    if (map && c.lat && c.lng) {
      map.flyTo({ center: [c.lng, c.lat], zoom: 15, duration: 800 });
    }
  };

  return (
    <div>
      <div className="relative w-full h-64 rounded-sm border border-gray-200">
        <div ref={mapContainerRef} className="w-full h-full rounded-sm" />
        <button
          onClick={handleCentrar}
          className="absolute top-2 right-9 bg-white border border-gray-300 rounded-sm px-2 py-1 text-xs font-semibold shadow hover:bg-gray-100 z-10"
          title="Centrar mapa"
        >
          Centrar
        </button>
      </div>
      <button
        onClick={handleAmpliar}
        className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-2 font-semibold font-montserrat"
      >
        <BsArrowsAngleExpand /> Ampliar mapa
      </button>
    </div>
  );
}
