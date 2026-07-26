// src/features/mapa-inmuebles/MapaInmuebles.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { fetchInmueblesEnBbox } from "./api";
import { VITE_MAPTILER_KEY } from "@/config/config.js";
import { formatPrecioPin, formatPrecioCompleto } from "@/utils/formatPrecio";
import { PropertyCard } from "./PropertyCard";
import {
  createZoomControl,
  createLocationControl,
} from "@/features/seleccionar-zona/components/MapControls";

export default function MapaInmuebles({
  lat,
  lng,
  zoom,
  operation,
  tipoInmueble,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterRef = useRef(null);
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInmueble, setSelectedInmueble] = useState(null);
  const [imagenIndex, setImagenIndex] = useState(0);
  const markersMapRef = useRef(new Map());

  // Reseteá el índice de imagen cada vez que cambia el inmueble seleccionado
  useEffect(() => {
    setImagenIndex(0);
  }, [selectedInmueble]);

  useEffect(() => {
    markersMapRef.current?.forEach((marker, id) => {
      const el = marker.getElement()?.querySelector(".price-pin");
      if (!el) return;
      el.classList.toggle("selected", selectedInmueble?.id === id);
    });
  }, [selectedInmueble]);

  // ──── Inicializar mapa ────
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      center: [lat || 4.6, lng || -74.1],
      zoom: zoom || 11,
    });

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${VITE_MAPTILER_KEY}`,
      { attribution: "", maxZoom: 20, tileSize: 512, zoomOffset: -1 },
    ).addTo(map);

    createLocationControl().addTo(map);
    createZoomControl().addTo(map);

    // MarkerCluster
    clusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 60,
      iconCreateFunction: (c) =>
        L.divIcon({
          html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#e6007a] text-white text-sm font-bold shadow-lg">${c.getChildCount()}</div>`,
          className: "",
          iconSize: [40, 40],
        }),
    });
    map.addLayer(clusterRef.current);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ──── Cargar inmuebles al mover el mapa (con debounce) ────
  const debounceRef = useRef(null);

  const loadInmuebles = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setLoading(true);
    try {
      const b = map.getBounds();
      const data = await fetchInmueblesEnBbox({
        minLat: b.getSouth(),
        minLng: b.getWest(),
        maxLat: b.getNorth(),
        maxLng: b.getEast(),
        operation,
        tipoInmueble,
      });
      setInmuebles(data);
    } catch (e) {
      console.error("Error cargando inmuebles:", e);
    } finally {
      setLoading(false);
    }
  }, [operation, tipoInmueble]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handler = () => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(loadInmuebles, 400);
    };

    map.on("moveend", handler);
    loadInmuebles(); // carga inicial

    return () => {
      map.off("moveend", handler);
      clearTimeout(debounceRef.current);
    };
  }, [loadInmuebles]);

  // ──── Renderizar markers ────
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();
    markersMapRef.current.clear(); // 👈 limpiar antes de repoblar

    inmuebles.forEach((p) => {
      const tempDiv = document.createElement("div");
      tempDiv.className = "price-pin";
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.textContent = formatPrecioPin(p.precio, p.operacion);
      document.body.appendChild(tempDiv);
      const width = tempDiv.offsetWidth;
      document.body.removeChild(tempDiv);

      const icon = L.divIcon({
        html: `<div class="price-pin" data-id="${p.id}">${formatPrecioPin(p.precio, p.operacion)}</div>`, // 👈 data-id agregado
        className: "",
        iconAnchor: [width / 2, 37],
      });

      const marker = L.marker([p.lat, p.lng], { icon });

      marker.on("click", () => {
        setSelectedInmueble(p);
      });

      markersMapRef.current.set(p.id, marker); // 👈 guardar referencia por id
      cluster.addLayer(marker);
    });
  }, [inmuebles]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-1000">
          Cargando inmuebles...
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />

      {selectedInmueble && (
        <PropertyCard
          inmueble={selectedInmueble}
          imagenIndex={imagenIndex}
          onNext={() =>
            setImagenIndex((i) =>
              i < (selectedInmueble.imagenes?.length ?? 1) - 1 ? i + 1 : 0,
            )
          }
          onPrev={() =>
            setImagenIndex((i) =>
              i > 0 ? i - 1 : (selectedInmueble.imagenes?.length ?? 1) - 1,
            )
          }
          onClose={() => setSelectedInmueble(null)}
        />
      )}
    </div>
  );
}
