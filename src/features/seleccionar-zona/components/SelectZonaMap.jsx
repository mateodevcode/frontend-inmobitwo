// src/features/seleccionar-zona/components/SelectZonaMap.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import { Geoman } from "@geoman-io/maplibre-geoman-free";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import { FaDrawPolygon } from "react-icons/fa";
import { TfiMapAlt } from "react-icons/tfi";
import {
  fetchRegionsGeoJSON,
  fetchStatesGeoJSON,
  fetchCitiesGeoJSON,
  fetchBarrios,
} from "../api";
import { ZoomControl, LocationControl } from "./MapControls";
import MapHintBanner from "./MapHintBanner";
import { apiBackend } from "@/api/apiBackend.js";
import { createPricePin } from "@/features/mapa-inmuebles/mapPins";
import { PropertyCard } from "@/features/mapa-inmuebles/PropertyCard";

const SELECTED_COLOR = "#e6007a"; // rosa normal (nivel seleccionado)
const HOVER_DARK_PINK = "#99004d"; // rosa oscuro (hover en municipio/barrio)
const HOVER_DARK = "#1a1a1a"; // hover en departamento (sin cambios)
const SELECTED_OPACITY = 0.4;
const ANCESTOR_OPACITY = 0.18; // "rosa claro" del nivel padre

// ──── estilos MapLibre (basados en una única propiedad "state") ────
const FILL_COLOR = [
  "case",
  ["==", ["get", "state"], "selected"],
  SELECTED_COLOR,
  ["==", ["get", "state"], "ancestor"],
  SELECTED_COLOR,
  "transparent",
];
const FILL_OPACITY = [
  "case",
  ["==", ["get", "state"], "selected"],
  SELECTED_OPACITY,
  ["==", ["get", "state"], "ancestor"],
  ANCESTOR_OPACITY,
  0,
];
const LINE_WIDTH = [
  "case",
  [
    "any",
    ["==", ["get", "state"], "selected"],
    ["==", ["get", "isHovered"], true],
  ],
  4,
  2,
];
function lineColorFor(hoverColor) {
  return [
    "case",
    ["==", ["get", "state"], "selected"],
    SELECTED_COLOR,
    ["==", ["get", "isHovered"], true],
    hoverColor,
    HOVER_DARK,
  ];
}
function makeFill(id) {
  return {
    id: `${id}-fill`,
    type: "fill",
    source: id,
    paint: { "fill-color": FILL_COLOR, "fill-opacity": FILL_OPACITY },
  };
}
function makeLine(id, hoverColor) {
  return {
    id: `${id}-line`,
    type: "line",
    source: id,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": lineColorFor(hoverColor),
      "line-width": LINE_WIDTH,
      "line-opacity": 1,
    },
  };
}
function setLineOpacity(map, id, val) {
  try {
    if (map.getLayer(`${id}-line`))
      map.setPaintProperty(`${id}-line`, "line-opacity", val);
  } catch {
    /* capa no disponible */
  }
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
  let x1 = Infinity,
    y1 = Infinity,
    x2 = -Infinity,
    y2 = -Infinity;
  c.forEach(([lng, lat]) => {
    if (lng < x1) x1 = lng;
    if (lng > x2) x2 = lng;
    if (lat < y1) y1 = lat;
    if (lat > y2) y2 = lat;
  });
  return [
    [x1, y1],
    [x2, y2],
  ];
}
function collectionBounds(fc) {
  if (!fc?.features?.length) return null;
  let x1 = Infinity,
    y1 = Infinity,
    x2 = -Infinity,
    y2 = -Infinity;
  fc.features.forEach((f) =>
    coords(f.geometry).forEach(([lng, lat]) => {
      if (lng < x1) x1 = lng;
      if (lng > x2) x2 = lng;
      if (lat < y1) y1 = lat;
      if (lat > y2) y2 = lat;
    }),
  );
  return x1 === Infinity
    ? null
    : [
        [x1, y1],
        [x2, y2],
      ];
}
function findFeature(fc, propKey, code) {
  return fc?.features?.find((f) => f.properties[propKey] === code) || null;
}

// ──── asigna estado (selected / ancestor / none) + hover a un FeatureCollection ────
function withState(features, codeKey, selectedCode, role, hovCode) {
  return features.map((f) => {
    const code = f.properties[codeKey];
    const state = code === selectedCode ? role : "none";
    return {
      ...f,
      properties: { ...f.properties, state, isHovered: code === hovCode },
    };
  });
}

export default function SelectZonaMap({
  selectedZone,
  onSelectZone,
  operation,
  tipoInmueble,
  drawMode,
  onToggleDrawMode,
  onPolygonChange,
  polygonProperties,
  polygonPropCount,
  polygonLoading,
  onVerInmuebles,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  const regionRawRef = useRef(null);
  const dptoRawRef = useRef(null);
  const mpioRawRef = useRef(null);
  const barrioRawRef = useRef(null);

  const selRef = useRef(null);
  const drawModeRef = useRef(false);
  const drawLayerRef = useRef(null);
  const geomanSetupRef = useRef(false);
  const gmRef = useRef(null);
  const propMarkersRef = useRef([]);
  const closeMarkerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hovCode, setHovCode] = useState(null);
  const [selectedInmueble, setSelectedInmueble] = useState(null);
  const [drawArmed, setDrawArmed] = useState(false);

  function clearPropMarkers() {
    propMarkersRef.current.forEach((m) => m.remove());
    propMarkersRef.current = [];
  }

  function removeCloseMarker() {
    if (closeMarkerRef.current) {
      closeMarkerRef.current.remove();
      closeMarkerRef.current = null;
    }
  }

  function placeCloseMarker(map, coord) {
    removeCloseMarker();
    if (!map || !coord) return;
    const el = document.createElement("div");
    el.className =
      "flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-[#e6007a] text-[#e6007a] shadow-md cursor-pointer hover:bg-[#e6007a] hover:text-white transition-colors";
    el.title = "Borrar polígono";
    el.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      handleDeletePolygon();
    });
    const marker = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat(coord)
      .addTo(map);
    closeMarkerRef.current = marker;
  }

  function getRingClosePoint(geojson) {
    const geom = geojson?.geometry;
    if (!geom) return null;
    const ring =
      geom.type === "Polygon"
        ? geom.coordinates?.[0]
        : geom.type === "MultiPolygon"
          ? geom.coordinates?.[0]?.[0]
          : null;
    return ring?.length ? ring[0] : null;
  }

  function handleDeletePolygon() {
    try {
      gmRef.current?.disableDraw();
    } catch {}
    if (drawLayerRef.current) {
      try {
        drawLayerRef.current.delete();
      } catch {}
      drawLayerRef.current = null;
    }
    removeCloseMarker();
    setDrawArmed(false);
    if (onPolygonChange) onPolygonChange(null);
  }

  selRef.current = selectedZone;
  drawModeRef.current = drawMode;

  // ──── info de seleccion derivada de selectedZone ────
  function getSelInfo() {
    const sel = selRef.current;
    if (!sel)
      return {
        region: null,
        dpto: null,
        mpio: null,
        barrio: null,
        regionRole: null,
        dptoRole: null,
        mpioRole: null,
      };
    if (sel.type === "region")
      return {
        region: sel.slug || sel.name,
        dpto: null,
        mpio: null,
        barrio: null,
        regionRole: "selected",
        dptoRole: null,
        mpioRole: null,
      };
    if (sel.type === "departamento")
      return {
        region: null,
        dpto: sel.daneCode,
        mpio: null,
        barrio: null,
        regionRole: "ancestor",
        dptoRole: "selected",
        mpioRole: null,
      };
    if (sel.type === "municipio")
      return {
        region: null,
        dpto: sel.dptoDaneCode,
        mpio: sel.daneCode,
        barrio: null,
        regionRole: "ancestor",
        dptoRole: "ancestor",
        mpioRole: "selected",
      };
    if (sel.type === "barrio")
      return {
        region: null,
        dpto: sel.dptoDaneCode,
        mpio: sel.mpioDaneCode,
        barrio: sel.daneCode,
        regionRole: "ancestor",
        dptoRole: "ancestor",
        mpioRole: "ancestor",
      };
    return {
      region: null,
      dpto: null,
      mpio: null,
      barrio: null,
      regionRole: null,
      dptoRole: null,
      mpioRole: null,
    };
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
    if (map.getSource(id)) {
      map.getSource(id).setData(data);
      return;
    }
    try {
      map.addSource(id, { type: "geojson", data });
      const hoverColor =
        id === "region" || id === "dpto" ? HOVER_DARK : HOVER_DARK_PINK;
      map.addLayer(makeFill(id));
      map.addLayer(makeLine(id, hoverColor));
    } catch (e) {
      console.error(`[Zona] error al crear capa ${id}:`, e.message);
    }
  }
  function sourceOff(map, id) {
    if (!map) return;
    try {
      if (map.getLayer(`${id}-line`)) map.removeLayer(`${id}-line`);
    } catch {}
    try {
      if (map.getLayer(`${id}-draw-line`)) map.removeLayer(`${id}-draw-line`);
    } catch {}
    try {
      if (map.getLayer(`${id}-fill`)) map.removeLayer(`${id}-fill`);
    } catch {}
    try {
      if (map.getSource(id)) map.removeSource(id);
    } catch {}
  }

  // ──── capas solo-stroke para modo dibujo (geoman) ────
  function addDrawSource(map, id, data, strokeColor, minZoom, maxZoom) {
    if (!map) return;
    if (map.getSource(id)) {
      map.getSource(id).setData(data);
      return;
    }
    try {
      map.addSource(id, { type: "geojson", data });
      map.addLayer({
        id: `${id}-draw-line`,
        type: "line",
        source: id,
        minzoom: minZoom || 5,
        maxzoom: maxZoom || 22,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": strokeColor || "#666",
          "line-width": 1.5,
          "line-opacity": 0.55,
        },
      });
    } catch (e) {
      console.error(`[Zona] error al crear capa draw ${id}:`, e.message);
    }
  }

  function clearDrawLayers(map) {
    sourceOff(map, "region");
    sourceOff(map, "dpto");
    sourceOff(map, "mpio");
    sourceOff(map, "barrio");
  }

  function loadDrawBoundaries(map) {
    setLoading(true);
    fetchStatesGeoJSON()
      .then((dptoData) => {
        addDrawSource(map, "dpto", dptoData, "#555", 5, 7.5);
        setLineOpacity(map, "dpto", 1);
        return fetchCitiesGeoJSON("91"); // cargar todos los municipios de Bogotá/Colombia como referencia
      })
      .then((mpioData) => {
        addDrawSource(map, "mpio", mpioData, "#777", 7.5, 10.5);
      })
      .catch((e) => console.error("[Zona] error cargando límites dibujo:", e))
      .finally(() => setLoading(false));
  }

  // ──── cargar barrios según zoom para modo dibujo ────
  function maybeLoadDrawBarrios(map, dptoCode, mpioCode) {
    if (!mpioCode) return;
    fetchBarrios(mpioCode)
      .then((data) => {
        if (!data?.features?.length) return;
        data.features = data.features.map((f) => ({
          ...f,
          properties: {
            ...f.properties,
            _mpioDane: mpioCode,
            _dptoDane: dptoCode,
          },
        }));
        addDrawSource(map, "barrio", data, "#999", 10.5, 14.5);
      })
      .catch(() => {});
  }

  // ──── refrescar todas las capas segun seleccion + hover ────
  function refreshLayers(hov) {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const { region, dpto, mpio, barrio, regionRole, dptoRole, mpioRole } =
      getSelInfo();
    const h = hov !== undefined ? hov : hovCode;

    if (regionRawRef.current) {
      const data = {
        ...regionRawRef.current,
        features: withState(
          regionRawRef.current.features,
          "slug",
          region,
          regionRole,
          h,
        ),
      };
      sourceData(map, "region", data);
    }
    if (dptoRawRef.current) {
      const data = {
        ...dptoRawRef.current,
        features: withState(
          dptoRawRef.current.features,
          "DPTO_CCDGO",
          dpto,
          dptoRole,
          h,
        ),
      };
      sourceData(map, "dpto", data);
    }
    if (mpioRawRef.current) {
      const data = {
        ...mpioRawRef.current,
        features: withState(
          mpioRawRef.current.features,
          "MPIO_CCNCT",
          mpio,
          mpioRole,
          h,
        ),
      };
      sourceData(map, "mpio", data);
    }
    if (barrioRawRef.current) {
      const data = {
        ...barrioRawRef.current,
        features: withState(
          barrioRawRef.current.features,
          "BAR_COD",
          barrio,
          "selected",
          h,
        ),
      };
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
      data.features = data.features.map((f) => ({
        ...f,
        properties: { ...f.properties, _dptoDane: code },
      }));
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
      data.features = data.features.map((f) => ({
        ...f,
        properties: { ...f.properties, _mpioDane: code, _dptoDane: dptoCode },
      }));
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
      center: [-74.1, 4.6],
      zoom: 6,
      minZoom: 5,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
      setupInteractivity(map);

      if (!drawModeRef.current) {
        setLoading(true);
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
      }
    });

    map.on("error", (e) => console.error("[Zona] error mapa:", e.error || e));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ──── refrescar al cambiar la seleccion ────
  useEffect(() => {
    if (!mapReady) return;
    refreshLayers();

    const map = mapRef.current;
    if (!map || !selectedZone) return;

    async function doZoom() {
      // hacer zoom a la zona seleccionada via GeoJSON
      let feat = null;
      if (selectedZone.type === "region") {
        feat = findFeature(regionRawRef.current, "slug", selectedZone.slug);
      } else if (selectedZone.type === "departamento") {
        feat = findFeature(
          dptoRawRef.current,
          "DPTO_CCDGO",
          selectedZone.daneCode,
        );
      } else if (selectedZone.type === "municipio") {
        feat = findFeature(
          mpioRawRef.current,
          "MPIO_CCNCT",
          selectedZone.daneCode,
        );
      } else if (selectedZone.type === "barrio") {
        feat = findFeature(
          barrioRawRef.current,
          "BAR_COD",
          selectedZone.daneCode,
        );
      }
      if (feat) {
        zoomToBounds(
          map,
          featBounds(feat),
          selectedZone.type === "barrio" ? 60 : 40,
        );
        return;
      }
      // fallback: geocodificar el nombre y hacer flyTo (busqueda desde input)
      try {
        const address = `${selectedZone.name}, Colombia`;
        const res = await apiBackend(
          `/api/geocode?address=${encodeURIComponent(address)}`,
          "GET",
        );
        if (res.success && res.data) {
          const zoomLevel =
            selectedZone.type === "region"
              ? 7
              : selectedZone.type === "departamento"
                ? 9
                : selectedZone.type === "barrio"
                  ? 15
                  : 13;
          map.flyTo({
            center: [res.data.longitude, res.data.latitude],
            zoom: zoomLevel,
            duration: 1500,
          });
        }
      } catch (e) {
        console.error("[Zona] error geocodificando zona:", e);
      }
    }
    doZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone, mapReady]);

  // ──── Geoman: configurar dibujo de polígonos ────
  const handleStartDrawing = () => {
    try {
      gmRef.current?.enableDraw("polygon");
      setDrawArmed(true);
    } catch (e) {
      console.error("[SelectZonaMap] enableDraw ERROR:", e);
    }
  };

  const setupGeoman = useCallback(
    async (map) => {
      if (!map || geomanSetupRef.current) return;
      geomanSetupRef.current = true;
      try {
        const gm = new Geoman(map, {
          settings: { useControlsUi: false },
          layerStyles: {
            polygon: {
              gm_main: [
                {
                  type: "fill",
                  paint: { "fill-color": "#e6007a", "fill-opacity": 0.15 },
                },
                {
                  type: "line",
                  paint: { "line-color": "#e6007a", "line-width": 2 },
                },
              ],
              gm_temporary: [
                {
                  type: "fill",
                  paint: { "fill-color": "#e6007a", "fill-opacity": 0.25 },
                },
                {
                  type: "line",
                  paint: { "line-color": "#e6007a", "line-width": 2 },
                },
              ],
            },
          },
        });
        gmRef.current = gm;

        await new Promise((resolve) => {
          map.once("gm:loaded", () => {
            resolve();
          });
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        map.on("gm:create", (event) => {
          if (drawLayerRef.current) {
            try {
              drawLayerRef.current.delete?.();
            } catch {}
          }
          drawLayerRef.current = event.feature;
          gm.disableDraw();
          setDrawArmed(false);

          let geojson;
          try {
            const exported = gm.features?.exportGeoJson?.();
            if (
              exported?.type === "FeatureCollection" &&
              exported.features?.length
            ) {
              geojson = exported.features[0];
              // forzar coordenadas 2D (Geoman puede incluir elevación)
              if (geojson?.geometry) {
                const geom = geojson.geometry;
                function stripElevation(ring) {
                  return ring.map((c) => [c[0], c[1]]);
                }
                if (geom.type === "Polygon") {
                  geom.coordinates = geom.coordinates.map(stripElevation);
                } else if (geom.type === "MultiPolygon") {
                  geom.coordinates = geom.coordinates.map((poly) =>
                    poly.map(stripElevation),
                  );
                }
              }
            } else if (event.feature?._geoJson) {
              geojson = event.feature._geoJson;
            } else if (event.feature?.getGeoJson) {
              geojson = event.feature.getGeoJson();
            } else {
              return;
            }
          } catch (e) {
            return;
          }

          if (onPolygonChange) onPolygonChange(geojson);
          const closeCoord = getRingClosePoint(geojson);
          if (closeCoord) placeCloseMarker(map, closeCoord);
        });

        map.on("gm:editend", (event) => {
          if (drawLayerRef.current && onPolygonChange) {
            let geojson;
            try {
              const exported = gm.features?.exportGeoJson?.();
              if (exported?.features?.length) {
                geojson = exported.features[0];
              }
            } catch {}
            if (!geojson) geojson = event.feature;
            onPolygonChange(geojson);
            const closeCoord = getRingClosePoint(geojson);
            if (closeCoord) placeCloseMarker(map, closeCoord);
          }
        });

        map.on("gm:remove", () => {
          drawLayerRef.current = null;
          removeCloseMarker();
          if (onPolygonChange) onPolygonChange(null);
        });
      } catch (e) {
        console.error("[SelectZonaMap] setupGeoman ERROR:", e);
        geomanSetupRef.current = false;
      }
    },
    [onPolygonChange],
  );

  // ──── efecto: reaccionar a cambios de drawMode ────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !mapReady) return;

    if (drawMode) {
      removeSelectLayers(map);
      clearDrawLayers(map);
      loadDrawBoundaries(map);

      setDrawArmed(false);

      if (!gmRef.current) {
        setupGeoman(map);
      }

      // zoom listener para cargar barrios dinámicamente
      const onZoom = () => {
        const z = map.getZoom();
        if (z >= 10.5) {
          const center = map.getCenter();
          const features = map.queryRenderedFeatures(undefined, {
            layers: ["mpio-draw-line"],
          });
          if (features.length) {
            const f = features[0];
            const mpioCode = f.properties.MPIO_CCNCT;
            const dptoCode = f.properties.DPTO_CCDGO;
            maybeLoadDrawBarrios(map, dptoCode, mpioCode);
          } else {
            maybeLoadDrawBarrios(map, "11", "11001");
          }
        } else {
          sourceOff(map, "barrio");
        }
      };
      map.on("zoom", onZoom);
      onZoom();

      return () => map.off("zoom", onZoom);
    } else {
      try {
        gmRef.current?.disableDraw();
      } catch {}
      removeCloseMarker();
      if (drawLayerRef.current) {
        try {
          drawLayerRef.current.delete?.();
        } catch {}
        drawLayerRef.current = null;
      }
      clearDrawLayers(map);

      if (!regionRawRef.current || !dptoRawRef.current) {
        setLoading(true);
        fetchRegionsGeoJSON()
          .then((regData) => {
            regionRawRef.current = regData;
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
      } else {
        refreshLayers();
      }
    }
  }, [drawMode, mapReady]); // eslint-disable-line react-hooks/exhaustive-deps

  function removeSelectLayers(map) {
    ["region", "dpto", "mpio", "barrio"].forEach((id) => {
      try {
        if (map.getLayer(`${id}-fill`)) map.removeLayer(`${id}-fill`);
      } catch {}
      try {
        if (map.getLayer(`${id}-line`)) map.removeLayer(`${id}-line`);
      } catch {}
    });
  }

  // ──── interactividad ────
  function setupInteractivity(map) {
    function safeQuery(point) {
      const ids = [
        "barrio-fill",
        "mpio-fill",
        "dpto-fill",
        "region-fill",
      ].filter((id) => map.getLayer(id));
      if (!ids.length) return [];
      try {
        return map.queryRenderedFeatures(point, { layers: ids });
      } catch {
        return [];
      }
    }

    map.on("click", (e) => {
      if (drawModeRef.current) return; // no drill-down en modo dibujo
      const feats = safeQuery(e.point);
      if (!feats.length) return;
      const f = feats[0];
      const lid = f.layer?.id;
      const p = f.properties;
      const sel = selRef.current;

      if (lid === "region-fill") {
        const slug = p.slug,
          name = p.REG_NAME;
        if (sel?.type === "region" && sel.slug === slug) return;

        onSelectZone(
          { type: "region", slug, name, dptoDaneCode: null },
          operation,
          tipoInmueble,
        );
        mpioRawRef.current = null;
        sourceOff(map, "mpio");
        barrioRawRef.current = null;
        sourceOff(map, "barrio");

        const feat = findFeature(regionRawRef.current, "slug", slug) || f;
        zoomToBounds(map, featBounds(feat), 40);
      } else if (lid === "dpto-fill") {
        const code = p.DPTO_CCDGO,
          name = p.DPTO_CNMBR;
        if (currentDptoCode(sel) === code) return; // ya es el depto activo → no se desmarca

        onSelectZone(
          { type: "departamento", daneCode: code, name },
          operation,
          tipoInmueble,
        );
        mpioRawRef.current = null;
        sourceOff(map, "mpio");
        barrioRawRef.current = null;
        sourceOff(map, "barrio");

        const feat = findFeature(dptoRawRef.current, "DPTO_CCDGO", code) || f;
        zoomToBounds(map, featBounds(feat), 40);
        loadMunicipios(code);
      } else if (lid === "mpio-fill") {
        const code = p.MPIO_CCNCT,
          name = p.MPIO_CNMBR,
          dpto = p._dptoDane;
        if (currentMpioCode(sel) === code) return; // ya es el municipio activo → no se desmarca

        onSelectZone(
          { type: "municipio", daneCode: code, name, dptoDaneCode: dpto },
          operation,
          tipoInmueble,
        );
        barrioRawRef.current = null;
        sourceOff(map, "barrio");

        const feat = findFeature(mpioRawRef.current, "MPIO_CCNCT", code) || f;
        zoomToBounds(map, featBounds(feat), 40);
        loadBarrios(code, dpto);
      } else if (lid === "barrio-fill") {
        const code = p.BAR_COD,
          name = p.NOMB_BARR,
          mpio = p._mpioDane,
          dpto = p._dptoDane;
        if (sel?.type === "barrio" && sel.daneCode === code) return; // ya es el barrio activo → no se desmarca

        onSelectZone(
          {
            type: "barrio",
            daneCode: code,
            name,
            mpioDaneCode: mpio,
            dptoDaneCode: dpto,
          },
          operation,
          tipoInmueble,
        );

        const feat = findFeature(barrioRawRef.current, "BAR_COD", code) || f;
        zoomToBounds(map, featBounds(feat), 60);
      }
    });

    map.on("mousemove", (e) => {
      if (drawModeRef.current) return; // no hover en modo dibujo
      const feats = safeQuery(e.point);
      if (!feats.length) {
        setHovCode(null);
        refreshLayers(null);
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        return;
      }
      const f = feats[0];
      const p = f.properties;
      let code = "",
        name = "";
      if (f.layer?.id === "region-fill") {
        code = p.slug;
        name = p.REG_NAME;
      } else if (f.layer?.id === "dpto-fill") {
        code = p.DPTO_CCDGO;
        name = p.DPTO_CNMBR;
      } else if (f.layer?.id === "mpio-fill") {
        code = p.MPIO_CCNCT;
        name = p.MPIO_CNMBR;
      } else if (f.layer?.id === "barrio-fill") {
        code = p.BAR_COD;
        name = p.NOMB_BARR;
      }
      setHovCode(code);
      refreshLayers(code);
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: "top",
        offset: 10,
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setHTML(`<span class="text-sm font-poppins">${name}</span>`)
        .addTo(map);
    });

    map.on("mouseleave", () => {
      setHovCode(null);
      refreshLayers(null);
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    });
  }

  const map = mapRef.current;

  // ──── actualizar marcadores de propiedades en modo dibujo ────
  useEffect(() => {
    const map = mapRef.current;
    clearPropMarkers();
    if (
      !map ||
      !map.isStyleLoaded() ||
      !drawMode ||
      !polygonProperties?.length
    ) {
      return;
    }

    polygonProperties.forEach((p) => {
      if (p.longitude == null || p.latitude == null) return;
      const isSelected = selectedInmueble?.id === p.id;
      const el = createPricePin(p, isSelected);
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setSelectedInmueble(p);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);
      propMarkersRef.current.push(marker);
    });

    return () => clearPropMarkers();
  }, [polygonProperties, drawMode, selectedInmueble]);

  const isDrawingActive = drawMode && drawArmed;

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-20">
          Cargando limites...
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: "#e0f2f1" }}
      />

      {/* ──── Botón toggle dibujo/selección (top-right) ──── */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4 z-50 flex flex-col gap-2">
        <div className="rounded-md overflow-hidden shadow-lg border-2 border-black/80 bg-white">
          <button
            className={`flex items-center gap-2 px-5 py-2.5 cursor-pointer text-sm font-poppins font-semibold transition-colors ${
              drawMode
                ? "bg-[#e6007a] text-white"
                : "bg-gray-50 text-black/80 hover:bg-white"
            }`}
            title={drawMode ? "Modo seleccion" : "Dibujar tu zona"}
            onClick={() => {
              onToggleDrawMode?.(!drawMode);
            }}
          >
            {drawMode ? (
              <>
                <TfiMapAlt size={18} />
                <span>Seleccionar zona</span>
              </>
            ) : (
              <>
                <FaDrawPolygon size={18} />
                <span>Dibujar tu zona</span>
              </>
            )}
          </button>
        </div>
        {drawMode && drawLayerRef.current && (
          <div className="rounded-md overflow-hidden shadow-lg border-2 border-black/80 bg-white">
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 cursor-pointer text-sm text-black/80 font-poppins font-semibold hover:bg-white w-full"
              title="Borrar polígono"
              onClick={handleDeletePolygon}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
              </svg>
              <span>Borrar polígono</span>
            </button>
          </div>
        )}
      </div>

      {mapReady && map && (
        <div className="absolute bottom-16 md:bottom-4 right-3 md:right-4 z-10 flex flex-col gap-2 items-end">
          <ZoomControl map={map} />
          {!drawMode && <LocationControl map={map} />}
        </div>
      )}

      {isDrawingActive && mapReady && (
        <div className="absolute top-16 md:top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-2 rounded-md text-sm z-40 pointer-events-none font-poppins w-80 md:w-130 text-center">
          Haz clic para marcar vértices. Doble clic para cerrar el polígono.
        </div>
      )}

      {drawMode && mapReady && !drawArmed && !drawLayerRef.current && (
        <div className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-md shadow-lg border-2 border-black/80 bg-[#e6007a] text-white cursor-pointer text-sm font-poppins font-semibold hover:bg-[#c40068] transition-colors"
            onClick={handleStartDrawing}
          >
            <FaDrawPolygon size={18} />
            <span>Dibujar tu zona</span>
          </button>
        </div>
      )}

      {drawMode && mapReady && drawLayerRef.current && (
        <div className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-md shadow-lg border-2 border-black/80 bg-[#e6007a] text-white cursor-pointer text-sm font-poppins font-semibold hover:bg-[#c40068] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onVerInmuebles}
            disabled={polygonLoading || !polygonPropCount}
          >
            {polygonLoading
              ? "Cargando..."
              : `Ver ${polygonPropCount?.toLocaleString() || 0} inmuebles`}
          </button>
        </div>
      )}

      {!drawMode && <MapHintBanner />}

      {selectedInmueble && (
        <PropertyCard
          inmueble={selectedInmueble}
          onClose={() => setSelectedInmueble(null)}
        />
      )}
    </div>
  );
}
