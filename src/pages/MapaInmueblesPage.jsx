// src/pages/MapaInmueblesPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MapaInmuebles from "@/features/mapa-inmuebles/MapaInmuebles";
import { apiBackend } from "@/api/apiBackend.js";

function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function MapaInmueblesPage() {
  const { operationAndType, cityAndDepartment } = useParams();

  const parts = (operationAndType || "venta-viviendas").split("-");
  const operation = parts[0];
  const tipoInmueble = parts.slice(1).join("-");

  const [center, setCenter] = useState({ lat: 4.6, lng: -74.1, zoom: 6 });
  const [boundary, setBoundary] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!cityAndDepartment || doneRef.current) return;
    doneRef.current = true;
    setGeocoding(true);

    const geoParts = cityAndDepartment.split("-");
    const hasCity = geoParts.length >= 2;

    async function init() {
      let tipo, endpoint, zoomLevel;

      if (hasCity) {
        const deptSlug = geoParts.pop();
        const citySlug = geoParts.join("-");
        tipo = "ciudad";
        endpoint = `/api/location-geojson?tipo=ciudad&city=${citySlug}&dept=${deptSlug}`;
        zoomLevel = 13;

        const address = `${slugToName(citySlug)}, ${slugToName(deptSlug)}, Colombia`;
        try {
          const res = await apiBackend(`/api/geocode?address=${encodeURIComponent(address)}`, "GET");
          if (res.success && res.data) {
            setCenter({ lat: res.data.latitude, lng: res.data.longitude, zoom: zoomLevel });
          }
        } catch {}
      } else {
        const slug = geoParts[0];
        let res = await apiBackend(`/api/location-geojson?tipo=region&region=${slug}`);
        if (res.success && res.data) {
          tipo = "region";
          endpoint = `/api/location-geojson?tipo=region&region=${slug}`;
          zoomLevel = 7;
        } else {
          res = await apiBackend(`/api/location-geojson?tipo=departamento&dept=${slug}`);
          tipo = "departamento";
          endpoint = `/api/location-geojson?tipo=departamento&dept=${slug}`;
          zoomLevel = 9;
        }

        const address = `${slugToName(slug)}, Colombia`;
        try {
          const geoRes = await apiBackend(`/api/geocode?address=${encodeURIComponent(address)}`, "GET");
          if (geoRes.success && geoRes.data) {
            setCenter({ lat: geoRes.data.latitude, lng: geoRes.data.longitude, zoom: zoomLevel });
          }
        } catch {}
      }

      if (endpoint) {
        try {
          const boundaryRes = await apiBackend(endpoint);
          if (boundaryRes.success && boundaryRes.data?.geometry) {
            setBoundary(boundaryRes.data.geometry);
          }
        } catch {}
      }

      setGeocoding(false);
    }

    init();
  }, [cityAndDepartment]);

  return (
    <div className="flex flex-col w-screen h-screen font-poppins">
      <div className="flex-1 relative">
        {geocoding ? (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <p className="text-sm text-black/40 animate-pulse">Ubicando zona...</p>
          </div>
        ) : (
          <MapaInmuebles
            lat={center.lat}
            lng={center.lng}
            zoom={center.zoom}
            operation={operation}
            tipoInmueble={tipoInmueble}
            boundary={boundary}
          />
        )}
      </div>
    </div>
  );
}
