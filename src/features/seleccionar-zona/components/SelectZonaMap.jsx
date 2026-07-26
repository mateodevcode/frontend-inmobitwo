// src/features/seleccionar-zona/components/SelectZonaMap.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchStatesGeoJSON, fetchCitiesGeoJSON, fetchBarrios } from "../api";
import { createZoomControl, createLocationControl } from "./MapControls";
import { VITE_MAPTILER_KEY } from "../../../config/config";
import MapHintBanner from "./MapHintBanner";

// ──── Constantes de estilo (tipo Idealista) ────
const STROKE_DEFAULT = "#1a1a1a"; // negro base
const STROKE_DIMMED = "#1a1a1a"; // deptos "de fondo" cuando ya se ven municipios
const STROKE_SELECTED = "#e6007a"; // rosa marca
const FILL_SELECTED = "#e6007a";

const WEIGHT_BASE = 2;
const WEIGHT_ACTIVE = 4; // hover o seleccionado = el doble

export default function SelectZonaMap({
  selectedZone,
  onSelectZone,
  operation,
  tipoInmueble,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const dptoLayerRef = useRef(null);
  const mpioLayerRef = useRef(null);
  const barrioLayerRef = useRef(null);

  const selectedZoneRef = useRef(selectedZone);
  const hoveredZoneRef = useRef(null);
  const visibleMpioDptoRef = useRef(null);
  const visibleBarrioMpioRef = useRef(null);

  const [hoveredZone, setHoveredZone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleMpioDpto, setVisibleMpioDpto] = useState(null);
  const [visibleBarrioMpio, setVisibleBarrioMpio] = useState(null);

  const skipZoneEffectRef = useRef(false);

  useEffect(() => {
    selectedZoneRef.current = selectedZone;
  }, [selectedZone]);
  useEffect(() => {
    hoveredZoneRef.current = hoveredZone;
  }, [hoveredZone]);
  useEffect(() => {
    visibleMpioDptoRef.current = visibleMpioDpto;
  }, [visibleMpioDpto]);
  useEffect(() => {
    visibleBarrioMpioRef.current = visibleBarrioMpio;
  }, [visibleBarrioMpio]);

  // ──── Estilos: departamentos ────
  const getDptoStyle = useCallback((feature) => {
    const code = feature.properties.DPTO_CCDGO;
    const sel = selectedZoneRef.current;
    const hov = hoveredZoneRef.current;
    const isSelected = sel?.type === "departamento" && sel.daneCode === code;
    const isHovered = hov?.type === "departamento" && hov.daneCode === code;
    const isMpioVisible = visibleMpioDptoRef.current !== null;

    let color = STROKE_DEFAULT;
    if (isSelected) color = STROKE_SELECTED;
    else if (isHovered) color = STROKE_DEFAULT;
    else if (isMpioVisible) color = STROKE_DIMMED;

    return {
      color,
      weight: isSelected || isHovered ? WEIGHT_ACTIVE : WEIGHT_BASE,
      fillColor: isSelected ? FILL_SELECTED : "transparent",
      fillOpacity: isSelected ? 0.4 : 0,
      opacity: isMpioVisible ? 0.5 : 1,
    };
  }, []);

  // ──── Estilos: municipios ────
  const getMpioStyle = useCallback((feature) => {
    const code = feature.properties.MPIO_CCNCT;
    const sel = selectedZoneRef.current;
    const hov = hoveredZoneRef.current;
    const isSelected = sel?.type === "municipio" && sel.daneCode === code;
    const isHovered = hov?.type === "municipio" && hov.daneCode === code;

    return {
      color: isSelected ? STROKE_SELECTED : STROKE_DEFAULT,
      weight: isSelected || isHovered ? WEIGHT_ACTIVE : WEIGHT_BASE,
      fillColor: isSelected ? FILL_SELECTED : "transparent",
      fillOpacity: isSelected ? 0.4 : 0,
    };
  }, []);

  // ──── Estilos: barrios ────
  const getBarrioStyle = useCallback((feature) => {
    const code = feature.properties.BAR_COD;
    const sel = selectedZoneRef.current;
    const hov = hoveredZoneRef.current;
    const isSelected = sel?.type === "barrio" && sel.daneCode === code;
    const isHovered = hov?.type === "barrio" && hov.daneCode === code;

    return {
      color: isSelected ? STROKE_SELECTED : STROKE_DEFAULT,
      weight: isSelected || isHovered ? WEIGHT_ACTIVE : WEIGHT_BASE,
      fillColor: isSelected ? FILL_SELECTED : "transparent",
      fillOpacity: isSelected ? 0.4 : 0,
    };
  }, []);

  // ──── Inicializar mapa ────
  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      center: [4.6, -74.1],
      zoom: 6,
      minZoom: 5,
    });
    createLocationControl().addTo(map);
    createZoomControl().addTo(map);

    // Manejo de resultado de geolocalización
    let userMarker = null;
    map.on("locationfound", (e) => {
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.circleMarker(e.latlng, {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: "#e6007a",
        fillOpacity: 1,
      }).addTo(map);
    });
    map.on("locationerror", (e) => {
      console.error("No se pudo obtener la ubicación:", e.message);
      alert(
        "No pudimos acceder a tu ubicación. Revisá los permisos del navegador.",
      );
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
    mapInstanceRef.current = map;

    map.on("zoomend", () => {
      const z = map.getZoom();
      if (z < 8 && visibleMpioDptoRef.current !== null) {
        if (mpioLayerRef.current) {
          map.removeLayer(mpioLayerRef.current);
          mpioLayerRef.current = null;
        }
        if (barrioLayerRef.current) {
          map.removeLayer(barrioLayerRef.current);
          barrioLayerRef.current = null;
        }
        setVisibleMpioDpto(null);
        setVisibleBarrioMpio(null);
      } else if (z < 13 && visibleBarrioMpioRef.current !== null) {
        if (barrioLayerRef.current) {
          map.removeLayer(barrioLayerRef.current);
          barrioLayerRef.current = null;
        }
        setVisibleBarrioMpio(null);
      }
    });

    setLoading(true);
    fetchStatesGeoJSON()
      .then((data) => renderDepartamentos(data))
      .catch((e) => console.error("Error cargando departamentos:", e))
      .finally(() => setLoading(false));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ──── Renderizar departamentos ────
  function renderDepartamentos(geoData) {
    const map = mapInstanceRef.current;
    if (!map || !geoData) return;
    if (dptoLayerRef.current) map.removeLayer(dptoLayerRef.current);

    dptoLayerRef.current = L.geoJSON(geoData, {
      style: getDptoStyle,
      onEachFeature: (feature, layer) => {
        const code = feature.properties.DPTO_CCDGO;
        const name = feature.properties.DPTO_CNMBR;
        layer.on("mouseover", () =>
          setHoveredZone({ type: "departamento", daneCode: code }),
        );
        layer.on("mouseout", () => setHoveredZone(null));
        layer.on("click", async () => {
          const sel = selectedZoneRef.current;
          if (sel?.daneCode === code && visibleMpioDptoRef.current === code) {
            skipZoneEffectRef.current = true;
            onSelectZone(null, operation, tipoInmueble);
            setVisibleMpioDpto(null);
            if (mpioLayerRef.current) {
              map.removeLayer(mpioLayerRef.current);
              mpioLayerRef.current = null;
            }
            map.setView([4.6, -74.1], 6);
          } else {
            skipZoneEffectRef.current = true;
            onSelectZone(
              { type: "departamento", daneCode: code, name },
              operation,
              tipoInmueble,
            );
            setVisibleMpioDpto(code);
            await renderMunicipios(code);
          }
        });
        layer.bindTooltip(name, { sticky: true, direction: "top" });
      },
    }).addTo(map);

    map.fitBounds(dptoLayerRef.current.getBounds(), { padding: [10, 10] });
  }

  // ──── Renderizar municipios ────
  async function renderMunicipios(stateDaneCode) {
    const map = mapInstanceRef.current;
    if (!map) return;
    setLoading(true);
    try {
      const data = await fetchCitiesGeoJSON(stateDaneCode);
      if (mpioLayerRef.current) map.removeLayer(mpioLayerRef.current);
      if (!data.features || data.features.length === 0) return;

      mpioLayerRef.current = L.geoJSON(data, {
        style: getMpioStyle,
        onEachFeature: (feature, layer) => {
          const code = feature.properties.MPIO_CCNCT;
          const name = feature.properties.MPIO_CNMBR;
          layer.on("mouseover", () =>
            setHoveredZone({ type: "municipio", daneCode: code }),
          );
          layer.on("mouseout", () => setHoveredZone(null));
          layer.on("click", async () => {
            const sel = selectedZoneRef.current;
            if (
              sel?.daneCode === code &&
              visibleBarrioMpioRef.current === code
            ) {
              skipZoneEffectRef.current = true;
              onSelectZone(
                { type: "departamento", daneCode: stateDaneCode, name: "" },
                operation,
                tipoInmueble,
              );
              setVisibleBarrioMpio(null);
              if (barrioLayerRef.current) {
                map.removeLayer(barrioLayerRef.current);
                barrioLayerRef.current = null;
              }
            } else {
              skipZoneEffectRef.current = true;
              const stateName = feature.properties.DPTO_CCDGO ? "" : "";
              onSelectZone(
                {
                  type: "municipio",
                  daneCode: code,
                  name,
                  dptoDaneCode: stateDaneCode,
                },
                operation,
                tipoInmueble,
              );
              const barriosData = await fetchBarrios(code);
              if (barriosData?.features?.length > 0) {
                setVisibleBarrioMpio(code);
                await renderBarrios(code);
              }
            }
          });
          layer.bindTooltip(name, { sticky: true, direction: "top" });
        },
      }).addTo(map);

      const deptGeo = await fetchStatesGeoJSON();
      const deptFeat = deptGeo.features.find(
        (f) => f.properties.DPTO_CCDGO === stateDaneCode,
      );
      if (deptFeat) {
        const lg = L.geoJSON(deptFeat);
        const bounds = lg.getBounds();
        lg.remove();
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
      }
    } catch (e) {
      console.error("Error cargando municipios:", e);
    } finally {
      setLoading(false);
    }
  }

  // ──── Renderizar barrios ────
  async function renderBarrios(cityDaneCode) {
    const map = mapInstanceRef.current;
    if (!map) return;
    setLoading(true);
    try {
      const data = await fetchBarrios(cityDaneCode);
      if (barrioLayerRef.current) map.removeLayer(barrioLayerRef.current);
      if (!data.features || data.features.length === 0) return;

      barrioLayerRef.current = L.geoJSON(data, {
        style: getBarrioStyle,
        onEachFeature: (feature, layer) => {
          const code = feature.properties.BAR_COD;
          const name = feature.properties.NOMB_BARR;
          layer.on("mouseover", () =>
            setHoveredZone({ type: "barrio", daneCode: code }),
          );
          layer.on("mouseout", () => setHoveredZone(null));
          layer.on("click", () => {
            const sel = selectedZoneRef.current;
            if (sel?.daneCode === code) {
              onSelectZone(
                {
                  type: "municipio",
                  daneCode: cityDaneCode,
                  name: "",
                  dptoDaneCode: "",
                },
                operation,
                tipoInmueble,
              );
            } else {
              onSelectZone(
                {
                  type: "barrio",
                  daneCode: code,
                  name,
                  mpioDaneCode: cityDaneCode,
                },
                operation,
                tipoInmueble,
              );
              const bounds = layer.getBounds();
              if (bounds?.isValid()) {
                map.flyToBounds(bounds, {
                  padding: [100, 100],
                  maxZoom: 16,
                  duration: 1.5,
                });
              } else {
                const center = layer.getLatLng();
                if (center) map.flyTo(center, 16, { duration: 1.5 });
              }
            }
          });
          layer.bindTooltip(name, { sticky: true, direction: "top" });
        },
      }).addTo(map);
      map.fitBounds(barrioLayerRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 13,
      });
    } catch (e) {
      console.error("Error cargando barrios:", e);
    } finally {
      setLoading(false);
    }
  }

  // ──── Actualizar estilos ────
  useEffect(() => {
    if (dptoLayerRef.current) dptoLayerRef.current.setStyle(getDptoStyle);
    if (mpioLayerRef.current) mpioLayerRef.current.setStyle(getMpioStyle);
    if (barrioLayerRef.current) barrioLayerRef.current.setStyle(getBarrioStyle);
  }, [selectedZone, hoveredZone, getDptoStyle, getMpioStyle, getBarrioStyle]);

  // ──── Zoom desde búsqueda externa ────
  const prevSearchZoneRef = useRef(null);

  useEffect(() => {
    if (!selectedZone || !mapInstanceRef.current || !dptoLayerRef.current) return;
    if (selectedZone === prevSearchZoneRef.current) return;
    prevSearchZoneRef.current = selectedZone;

    // Si el cambio vino del propio mapa, no duplicar el zoom
    if (skipZoneEffectRef.current) {
      skipZoneEffectRef.current = false;
      return;
    }

    if (selectedZone.type === "municipio" && selectedZone.dptoDaneCode) {
      setVisibleMpioDpto(selectedZone.dptoDaneCode);
      renderMunicipios(selectedZone.dptoDaneCode);
    } else if (selectedZone.type === "departamento" && selectedZone.daneCode) {
      setVisibleMpioDpto(selectedZone.daneCode);
      renderMunicipios(selectedZone.daneCode);
    }
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-1000">
          Cargando límites...
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ background: "#e0f2f1" }}
      />
      <MapHintBanner />
    </div>
  );
}
