// src/features/seleccionar-zona/components/SelectZonaMap.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchStatesGeoJSON, fetchCitiesGeoJSON, fetchBarrios } from "../api";
import { VITE_MAPTILER_KEY } from "../../../config/config";

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
    // ──── Control de zoom personalizado ────
    const ZoomControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: function (map) {
        const container = L.DomUtil.create("div", "custom-zoom-control");
        container.innerHTML = `
      <button class="custom-zoom-btn" data-action="in" title="Acercar">+</button>
      <button class="custom-zoom-btn" data-action="out" title="Alejar">−</button>
    `;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        container
          .querySelector('[data-action="in"]')
          .addEventListener("click", () => map.zoomIn());
        container
          .querySelector('[data-action="out"]')
          .addEventListener("click", () => map.zoomOut());

        return container;
      },
    });
    new ZoomControl().addTo(map);

    // ──── Control de ubicación personalizado ────
    const LocationControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: function (map) {
        const container = L.DomUtil.create("div", "custom-location-control");
        container.innerHTML = `
      <button class="custom-location-btn" title="Tu ubicación">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span>Tu ubicación</span>
      </button>
    `;
        L.DomEvent.disableClickPropagation(container);

        container.querySelector("button").addEventListener("click", () => {
          map.locate({ setView: true, maxZoom: 15 });
        });

        return container;
      },
    });
    new LocationControl().addTo(map);

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
            onSelectZone(null, operation, tipoInmueble);
            setVisibleMpioDpto(null);
            if (mpioLayerRef.current) {
              map.removeLayer(mpioLayerRef.current);
              mpioLayerRef.current = null;
            }
            map.setView([4.6, -74.1], 6);
          } else {
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

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-black/85 text-white px-4 py-2 rounded-full text-xs z-[1000]">
          Cargando límites...
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ background: "#e0f2f1" }}
      />
    </div>
  );
}
