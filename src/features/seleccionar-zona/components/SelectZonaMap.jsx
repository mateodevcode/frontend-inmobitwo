// src/features/seleccionar-zona/components/SelectZonaMap.jsx
import { useState, useRef, useEffect } from "react";
import * as maplibregl from "maplibre-gl";
import { fetchRegionsGeoJSON, fetchStatesGeoJSON, fetchCitiesGeoJSON, fetchBarrios } from "../api";
import { ZoomControl, LocationControl } from "./MapControls";
import MapHintBanner from "./MapHintBanner";

const SELECTED_COLOR = "#e6007a";   // rosa normal (nivel seleccionado)
const HOVER_DARK_PINK = "#99004d";  // rosa oscuro (hover en municipio/barrio)
const HOVER_DARK = "#1a1a1a";       // hover en departamento (sin cambios)
const SELECTED_OPACITY = 0.4;
const ANCESTOR_OPACITY = 0.18;       // "rosa claro" del nivel padre

// ──── estilos MapLibre (basados en una única propiedad "state") ────
const FILL_COLOR = [
  "case",
  ["==", ["get", "state"], "selected"], SELECTED_COLOR,
  ["==", ["get", "state"], "ancestor"], SELECTED_COLOR,
  "transparent",
];
const FILL_OPACITY = [
  "case",
  ["==", ["get", "state"], "selected"], SELECTED_OPACITY,
  ["==", ["get", "state"], "ancestor"], ANCESTOR_OPACITY,
  0,
];
const LINE_WIDTH = [
  "case",
  ["any", ["==", ["get", "state"], "selected"], ["==", ["get", "isHovered"], true]],
  4,
  2,
];
function lineColorFor(hoverColor) {
  return [
    "case",
    ["==", ["get", "state"], "selected"], SELECTED_COLOR,
    ["==", ["get", "isHovered"], true], hoverColor,
    HOVER_DARK,
  ];
}
function makeFill(id) {
  return { id: `${id}-fill`, type: "fill", source: id, paint: { "fill-color": FILL_COLOR, "fill-opacity": FILL_OPACITY } };
}
function makeLine(id, hoverColor) {
  return { id: `${id}-line`, type: "line", source: id, paint: { "line-color": lineColorFor(hoverColor), "line-width": LINE_WIDTH, "line-opacity": 1 } };
}
function setLineOpacity(map, id, val) {
  try { if (map.getLayer(`${id}-line`)) map.setPaintProperty(`${id}-line`, "line-opacity", val); } catch {}
}

// ──── helpers de geometria ────
function coords(g) {
  if (!g) return [];
  const t = g.type;
  if (t === "Point") return [g.coordinates];
  if (t === "MultiPoint" || t === "LineString") return g.coordinates;
  if (t === "MultiLineString" || t === "Polygon") return g.coordinates.flat();
  if (t === "MultiPolygon") return g.coordinates.flat(2);
  if (t === "GeometryCollection") return g.geometries.flatMap(coords);
  return [];
}
function featBounds(feat) {
  if (!feat?.geometry) return null;
  const c = coords(feat.geometry);
  if (!c.length) return null;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  c.forEach(([lng, lat]) => { if (lng < x1) x1 = lng; if (lng > x2) x2 = lng; if (lat < y1) y1 = lat; if (lat > y2) y2 = lat; });
  return [[x1, y1], [x2, y2]];
}
function collectionBounds(fc) {
  if (!fc?.features?.length) return null;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  fc.features.forEach((f) => coords(f.geometry).forEach(([lng, lat]) => {
    if (lng < x1) x1 = lng; if (lng > x2) x2 = lng; if (lat < y1) y1 = lat; if (lat > y2) y2 = lat;
  }));
  return x1 === Infinity ? null : [[x1, y1], [x2, y2]];
}
function findFeature(fc, propKey, code) {
  return fc?.features?.find((f) => f.properties[propKey] === code) || null;
}

// ──── asigna estado (selected / ancestor / none) + hover a un FeatureCollection ────
function withState(features, codeKey, selectedCode, role, hovCode) {
  return features.map((f) => {
    const code = f.properties[codeKey];
    const state = code === selectedCode ? role : "none";
    return { ...f, properties: { ...f.properties, state, isHovered: code === hovCode } };
  });
}

export default function SelectZonaMap({ selectedZone, onSelectZone, operation, tipoInmueble }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  const regionRawRef = useRef(null);
  const dptoRawRef = useRef(null);
  const mpioRawRef = useRef(null);
  const barrioRawRef = useRef(null);

  const selRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hovCode, setHovCode] = useState(null);

  selRef.current = selectedZone;

  // ──── info de seleccion derivada de selectedZone ────
  function getSelInfo() {
    const sel = selRef.current;
    if (!sel) return { region: null, dpto: null, mpio: null, barrio: null, regionRole: null, dptoRole: null, mpioRole: null };
    if (sel.type === "region") return { region: sel.slug || sel.name, dpto: null, mpio: null, barrio: null, regionRole: "selected", dptoRole: null, mpioRole: null };
    if (sel.type === "departamento") return { region: null, dpto: sel.daneCode, mpio: null, barrio: null, regionRole: "ancestor", dptoRole: "selected", mpioRole: null };
    if (sel.type === "municipio") return { region: null, dpto: sel.dptoDaneCode, mpio: sel.daneCode, barrio: null, regionRole: "ancestor", dptoRole: "ancestor", mpioRole: "selected" };
    if (sel.type === "barrio") return { region: null, dpto: sel.dptoDaneCode, mpio: sel.mpioDaneCode, barrio: sel.daneCode, regionRole: "ancestor", dptoRole: "ancestor", mpioRole: "ancestor" };
    return { region: null, dpto: null, mpio: null, barrio: null, regionRole: null, dptoRole: null, mpioRole: null };
  }
  // departamento/municipio "activos" independientemente del nivel más profundo seleccionado
  function currentDptoCode(sel) {
    if (!sel) return null;
    if (sel.type === "departamento") return sel.daneCode;
    return sel.dptoDaneCode ?? null;
  }
  function currentMpioCode(sel) {
    if (!sel) return null;
    if (sel.type === "municipio") return sel.daneCode;
    if (sel.type === "barrio") return sel.mpioDaneCode;
    return null;
  }

  // ──── helpers de capa ────
  function sourceData(map, id, data) {
    if (!map) return;
    if (map.getSource(id)) { map.getSource(id).setData(data); return; }
    try {
      map.addSource(id, { type: "geojson", data });
      const hoverColor = id === "region" || id === "dpto" ? HOVER_DARK : HOVER_DARK_PINK;
      map.addLayer(makeFill(id));
      map.addLayer(makeLine(id, hoverColor));
    } catch (e) {
      console.error(`[Zona] error al crear capa ${id}:`, e.message);
    }
  }
  function sourceOff(map, id) {
    if (!map) return;
    try { if (map.getLayer(`${id}-line`)) map.removeLayer(`${id}-line`); } catch {}
    try { if (map.getLayer(`${id}-fill`)) map.removeLayer(`${id}-fill`); } catch {}
    try { if (map.getSource(id)) map.removeSource(id); } catch {}
  }

  // ──── refrescar todas las capas segun seleccion + hover ────
  function refreshLayers(hov) {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const { region, dpto, mpio, barrio, regionRole, dptoRole, mpioRole } = getSelInfo();
    const h = hov !== undefined ? hov : hovCode;

    if (regionRawRef.current) {
      const data = { ...regionRawRef.current, features: withState(regionRawRef.current.features, "slug", region, regionRole, h) };
      sourceData(map, "region", data);
    }
    if (dptoRawRef.current) {
      const data = { ...dptoRawRef.current, features: withState(dptoRawRef.current.features, "DPTO_CCDGO", dpto, dptoRole, h) };
      sourceData(map, "dpto", data);
    }
    if (mpioRawRef.current) {
      const data = { ...mpioRawRef.current, features: withState(mpioRawRef.current.features, "MPIO_CCNCT", mpio, mpioRole, h) };
      sourceData(map, "mpio", data);
    }
    if (barrioRawRef.current) {
      const data = { ...barrioRawRef.current, features: withState(barrioRawRef.current.features, "BAR_COD", barrio, "selected", h) };
      sourceData(map, "barrio", data);
    }
  }

  // ──── carga de municipios de un departamento ────
  async function loadMunicipios(code) {
    const map = mapRef.current;
    if (!map) return;
    setLoading(true);
    try {
      const data = await fetchCitiesGeoJSON(code);
      if (!data?.features?.length) {
        mpioRawRef.current = null;
        sourceOff(map, "mpio");
        setLineOpacity(map, "dpto", 1);
        return;
      }
      data.features = data.features.map((f) => ({ ...f, properties: { ...f.properties, _dptoDane: code } }));
      mpioRawRef.current = data;
      refreshLayers();
      setLineOpacity(map, "dpto", 0.5); // atenúa el borde del depto al haber municipios encima
    } catch (e) {
      console.error("[Zona] error cargando municipios:", e);
    } finally {
      setLoading(false);
    }
  }

  // ──── carga de barrios de un municipio ────
  async function loadBarrios(code, dptoCode) {
    const map = mapRef.current;
    if (!map) return;
    setLoading(true);
    try {
      const data = await fetchBarrios(code);
      if (!data?.features?.length) {
        barrioRawRef.current = null;
        sourceOff(map, "barrio");
        setLineOpacity(map, "mpio", 1);
        return;
      }
      data.features = data.features.map((f) => ({ ...f, properties: { ...f.properties, _mpioDane: code, _dptoDane: dptoCode } }));
      barrioRawRef.current = data;
      refreshLayers();
      setLineOpacity(map, "mpio", 0.5);
    } catch (e) {
      console.error("[Zona] error cargando barrios:", e);
    } finally {
      setLoading(false);
    }
  }

  function zoomToBounds(map, bounds, padding = 40) {
    if (!bounds) return;
    map.fitBounds(bounds, { padding, duration: 1200, maxZoom: 17 });
  }

  // ──── crear mapa ────
  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: { version: 8, sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } }, layers: [{ id: "osm-tiles", type: "raster", source: "osm" }] },
      center: [-74.1, 4.6], zoom: 6, minZoom: 5,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
      setupInteractivity(map);
      setLoading(true);

      // Cargar regiones primero, luego departamentos
      fetchRegionsGeoJSON()
        .then((regData) => {
          regionRawRef.current = regData;
          refreshLayers();
          return fetchStatesGeoJSON();
        })
        .then((data) => {
          dptoRawRef.current = data;
          refreshLayers();
          const b = collectionBounds(data);
          if (b) map.fitBounds(b, { padding: 10 });
        })
        .catch((e) => console.error("[Zona] error cargando datos:", e))
        .finally(() => setLoading(false));
    });

    map.on("error", (e) => console.error("[Zona] error mapa:", e.error || e));

    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ──── refrescar al cambiar la seleccion ────
  useEffect(() => {
    if (!mapReady) return;
    refreshLayers();

    const map = mapRef.current;
    if (!map || !selectedZone) return;

    // hacer zoom a la zona seleccionada
    let feat = null;
    if (selectedZone.type === "region") {
      feat = findFeature(regionRawRef.current, "slug", selectedZone.slug);
    } else if (selectedZone.type === "departamento") {
      feat = findFeature(dptoRawRef.current, "DPTO_CCDGO", selectedZone.daneCode);
    } else if (selectedZone.type === "municipio") {
      feat = findFeature(mpioRawRef.current, "MPIO_CCNCT", selectedZone.daneCode);
    } else if (selectedZone.type === "barrio") {
      feat = findFeature(barrioRawRef.current, "BAR_COD", selectedZone.daneCode);
    }
    if (feat) zoomToBounds(map, featBounds(feat), selectedZone.type === "barrio" ? 60 : 40);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone, mapReady]);

  // ──── interactividad ────
  function setupInteractivity(map) {
    function safeQuery(point) {
      const ids = ["barrio-fill", "mpio-fill", "dpto-fill", "region-fill"].filter((id) => map.getLayer(id));
      if (!ids.length) return [];
      try { return map.queryRenderedFeatures(point, { layers: ids }); } catch { return []; }
    }

    map.on("click", (e) => {
      const feats = safeQuery(e.point);
      if (!feats.length) return;
      const f = feats[0];
      const lid = f.layer?.id;
      const p = f.properties;
      const sel = selRef.current;

      if (lid === "region-fill") {
        const slug = p.slug, name = p.REG_NAME;
        if (sel?.type === "region" && sel.slug === slug) return;

        onSelectZone({ type: "region", slug, name, dptoDaneCode: null }, operation, tipoInmueble);
        mpioRawRef.current = null; sourceOff(map, "mpio");
        barrioRawRef.current = null; sourceOff(map, "barrio");

        const feat = findFeature(regionRawRef.current, "slug", slug) || f;
        zoomToBounds(map, featBounds(feat), 40);
      } else if (lid === "dpto-fill") {
        const code = p.DPTO_CCDGO, name = p.DPTO_CNMBR;
        if (currentDptoCode(sel) === code) return; // ya es el depto activo → no se desmarca

        onSelectZone({ type: "departamento", daneCode: code, name }, operation, tipoInmueble);
        mpioRawRef.current = null; sourceOff(map, "mpio");
        barrioRawRef.current = null; sourceOff(map, "barrio");

        const feat = findFeature(dptoRawRef.current, "DPTO_CCDGO", code) || f;
        zoomToBounds(map, featBounds(feat), 40);
        loadMunicipios(code);
      } else if (lid === "mpio-fill") {
        const code = p.MPIO_CCNCT, name = p.MPIO_CNMBR, dpto = p._dptoDane;
        if (currentMpioCode(sel) === code) return; // ya es el municipio activo → no se desmarca

        onSelectZone({ type: "municipio", daneCode: code, name, dptoDaneCode: dpto }, operation, tipoInmueble);
        barrioRawRef.current = null; sourceOff(map, "barrio");

        const feat = findFeature(mpioRawRef.current, "MPIO_CCNCT", code) || f;
        zoomToBounds(map, featBounds(feat), 40);
        loadBarrios(code, dpto);
      } else if (lid === "barrio-fill") {
        const code = p.BAR_COD, name = p.NOMB_BARR, mpio = p._mpioDane, dpto = p._dptoDane;
        if (sel?.type === "barrio" && sel.daneCode === code) return; // ya es el barrio activo → no se desmarca

        onSelectZone({ type: "barrio", daneCode: code, name, mpioDaneCode: mpio, dptoDaneCode: dpto }, operation, tipoInmueble);

        const feat = findFeature(barrioRawRef.current, "BAR_COD", code) || f;
        zoomToBounds(map, featBounds(feat), 60);
      }
    });

    map.on("mousemove", (e) => {
      const feats = safeQuery(e.point);
      if (!feats.length) {
        setHovCode(null); refreshLayers(null);
        if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
        return;
      }
      const f = feats[0];
      const p = f.properties;
      let code = "", name = "";
      if (f.layer?.id === "region-fill") { code = p.slug; name = p.REG_NAME; }
      else if (f.layer?.id === "dpto-fill") { code = p.DPTO_CCDGO; name = p.DPTO_CNMBR; }
      else if (f.layer?.id === "mpio-fill") { code = p.MPIO_CCNCT; name = p.MPIO_CNMBR; }
      else if (f.layer?.id === "barrio-fill") { code = p.BAR_COD; name = p.NOMB_BARR; }
      setHovCode(code);
      refreshLayers(code);
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, anchor: "top", offset: 10 })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setHTML(`<span class="text-sm font-poppins">${name}</span>`)
        .addTo(map);
    });

    map.on("mouseleave", () => {
      setHovCode(null); refreshLayers(null);
      if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
    });
  }

  const map = mapRef.current;

  return (
    <div className="relative w-full h-full">
      {loading && <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-20">Cargando limites...</div>}
      <div ref={containerRef} className="w-full h-full" style={{ background: "#e0f2f1" }} />
      {mapReady && map && (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <LocationControl map={map} />
          <ZoomControl map={map} />
        </div>
      )}
      <MapHintBanner />
    </div>
  );
}