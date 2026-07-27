// src/features/mapa-inmuebles/MapaInmuebles.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import Supercluster from "supercluster";
import { fetchInmueblesEnBbox } from "./api";
import { formatPrecioPin } from "@/utils/formatPrecio";
import { PropertyCard } from "./PropertyCard";
import {
  ZoomControl,
  LocationControl,
} from "@/features/seleccionar-zona/components/MapControls";
import InputSearchZona from "../seleccionar-zona/components/InputSearchZona";
import { useSelectZona } from "../seleccionar-zona/hooks/useSelectZona";
import { apiBackend } from "@/api/apiBackend.js";

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createClusterIcon(count) {
  const el = document.createElement("div");
  el.className =
    "flex items-center justify-center w-10 h-10 rounded-full bg-[#e6007a] text-white text-sm font-bold shadow-lg cursor-pointer";
  el.textContent = count;
  return el;
}

function createPricePin(props, isSelected) {
  const el = document.createElement("div");
  el.className = `price-pin${isSelected ? " selected" : ""}`;
  el.textContent = formatPrecioPin(props.precio, props.operacion);
  return el;
}

export default function MapaInmuebles({
  lat,
  lng,
  zoom,
  operation,
  tipoInmueble,
  boundary,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterIndexRef = useRef(new Supercluster({ radius: 60, maxZoom: 16 }));
  const debounceRef = useRef(null);
  const markersRef = useRef([]);
  const opRef = useRef(operation);
  const tipoRef = useRef(tipoInmueble);
  const loadedRef = useRef(false);

  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInmueble, setSelectedInmueble] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const { setSelectedZone: selectZone } = useSelectZona();

  useEffect(() => {
    opRef.current = operation;
  }, [operation]);
  useEffect(() => {
    tipoRef.current = tipoInmueble;
  }, [tipoInmueble]);

  function clearMarkers() {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }

  function renderMarkers() {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    clearMarkers();

    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
    const z = Math.floor(map.getZoom());

    let features = [];
    try {
      features = clusterIndexRef.current.getClusters(bbox, z);
    } catch {
      return;
    }
    console.log(
      `[MapaInmuebles] Renderizando ${features.length} features (zoom=${z})`,
    );

    features.forEach((f) => {
      const [flng, flat] = f.geometry.coordinates;
      const props = f.properties;
      if (props.cluster) {
        const el = createClusterIcon(props.point_count);
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const expZoom = clusterIndexRef.current.getClusterExpansionZoom(
            props.cluster_id,
          );
          map.flyTo({ center: [flng, flat], zoom: expZoom });
        });
        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([flng, flat])
          .addTo(map);
        markersRef.current.push(m);
      } else {
        const isSelected = selectedInmueble?.id === props.id;
        const el = createPricePin(props, isSelected);
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          setSelectedInmueble(props);
        });
        const m = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([flng, flat])
          .addTo(map);
        markersRef.current.push(m);
      }
    });
  }

  const loadInmuebles = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    console.log("[MapaInmuebles] Cargando inmuebles...");
    setLoading(true);
    try {
      const b = map.getBounds();
      const data = await fetchInmueblesEnBbox({
        minLat: b.getSouth(),
        minLng: b.getWest(),
        maxLat: b.getNorth(),
        maxLng: b.getEast(),
        operation: opRef.current,
        tipoInmueble: tipoRef.current,
      });
      console.log(`[MapaInmuebles] Recibidos ${data.length} inmuebles`);
      setInmuebles(data);
    } catch (e) {
      console.error("[MapaInmuebles] Error cargando inmuebles:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ════ EFECTOS ════

  function renderBoundary(map, geom) {
    if (map.getSource("zonaboundary")) {
      map.getSource("zonaboundary").setData({ type: "Feature", geometry: geom, properties: {} });
    } else {
      map.addSource("zonaboundary", { type: "geojson", data: { type: "Feature", geometry: geom, properties: {} } });
      map.addLayer({ id: "zona-fill", type: "fill", source: "zonaboundary", paint: { "fill-color": "#e6007a", "fill-opacity": 0.15 } });
      map.addLayer({ id: "zona-line", type: "line", source: "zonaboundary", paint: { "line-color": "#e6007a", "line-width": 2, "line-opacity": 0.6 } });
    }
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    function walk(c) { if (typeof c[0] === "number") { if (c[0] < x1) x1 = c[0]; if (c[0] > x2) x2 = c[0]; if (c[1] < y1) y1 = c[1]; if (c[1] > y2) y2 = c[1]; } else c.forEach(walk); }
    walk(geom.coordinates || []);
    if (x1 !== Infinity) map.fitBounds([[x1, y1], [x2, y2]], { padding: 40, duration: 1000, maxZoom: 14 });
  }

  // 1. Crear mapa (debe ir PRIMERO)
  useEffect(() => {
    if (mapInstanceRef.current) return;
    console.log("[MapaInmuebles] Creando mapa...");

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
      },
      center: [lng || -74.1, lat || 4.6],
      zoom: zoom || 11,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    map.on("style.load", () => console.log("[MapaInmuebles] style.load"));
    map.on("error", (e) => console.error("[MapaInmuebles] Error:", e));

    const tryInit = () => {
      if (map !== mapInstanceRef.current) return; // mapa destruido por StrictMode
      if (loadedRef.current) return;
      if (!map.isStyleLoaded()) return;
      if (!map.loaded()) return;
      console.log("[MapaInmuebles] Inicializando (loaded=true)");
      loadedRef.current = true;
      setMapReady(true);

      map.on("moveend", () => {
        console.log("[MapaInmuebles] moveend");
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(loadInmuebles, 400);
      });

      loadInmuebles();
    };

    map.on("load", tryInit); // camino normal
    map.on("idle", tryInit); // fallback si load tarda

    return () => {
      console.log("[MapaInmuebles] Destruyendo mapa");
      loadedRef.current = false;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Reconstruir indice + render cuando cambian inmuebles
  useEffect(() => {
    console.log(`[MapaInmuebles] Indice: ${inmuebles.length} inmuebles`);
    const index = new Supercluster({ radius: 60, maxZoom: 16 });
    const points = inmuebles
      .filter((p) => p.lat && p.lng)
      .map((p) => ({
        type: "Feature",
        properties: p,
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      }));
    if (points.length > 0) index.load(points);
    clusterIndexRef.current = index;
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inmuebles]);

  // 3. Re-render cuando cambia el seleccionado
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInmueble]);

  // 4. Renderizar borde de zona (region/depto/ciudad)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !boundary || !map.isStyleLoaded()) return;
    renderBoundary(map, boundary);
  }, [boundary, mapReady]);

  const handleSelectZone = async (zone, op, tipo) => {
    selectZone(zone, op, tipo);

    if (!zone) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const address = `${zone.name}, Colombia`;
    try {
      const res = await apiBackend(
        `/api/geocode?address=${encodeURIComponent(address)}`,
        "GET",
      );
      if (res.success && res.data) {
        const { latitude, longitude } = res.data;
        map.flyTo({ center: [longitude, latitude], zoom: zone.type === "region" ? 7 : zone.type === "departamento" ? 9 : 13, duration: 1500 });
      }
    } catch (e) {
      console.error("[MapaInmuebles] error geocodificando zona:", e);
    }

    // buscar y mostrar poligono de la zona (region y depto desde search)
    try {
      let endpoint;
      if (zone.type === "region") {
        endpoint = `/api/location-geojson?tipo=region&region=${zone.slug || slugify(zone.name)}`;
      } else if (zone.type === "departamento") {
        endpoint = `/api/location-geojson?tipo=departamento&dept=${slugify(zone.name)}`;
      }
      if (endpoint) {
        const bres = await apiBackend(endpoint);
        if (bres.success && bres.data?.geometry) {
          renderBoundary(map, bres.data.geometry);
        }
      }
    } catch {}
  };
  const map = mapInstanceRef.current;

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-10">
          Cargando inmuebles...
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
      {mapReady && map && (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 items-end">
          <LocationControl map={map} />
          <ZoomControl map={map} />
        </div>
      )}
      {selectedInmueble && (
        <PropertyCard
          inmueble={selectedInmueble}
          onClose={() => setSelectedInmueble(null)}
        />
      )}
      <div className="absolute top-3 right-4 z-10">
        <InputSearchZona
          onSelectZone={(zone) =>
            handleSelectZone(zone, operation, tipoInmueble)
          }
          operation={operation}
          tipoInmueble={tipoInmueble}
          className="w-80 border-2"
          showX={true}
        />
      </div>
    </div>
  );
}
