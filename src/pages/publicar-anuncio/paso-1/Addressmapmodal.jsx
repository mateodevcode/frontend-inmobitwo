// src/components/publicar-anuncio/components/Addressmapmodal.jsx
//
// Modal de confirmacion de ubicacion. Reutiliza el patron de Dialog de
// Headless UI v2 que ya usamos en "Nadie contacta a un anuncio sin fotos".

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import * as maplibregl from "maplibre-gl";
import { X, AlertTriangle } from "lucide-react";

const pinSvg = `
  <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#FF1B1C"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>
`;

const LOW_CONFIDENCE_THRESHOLD = 0.4;

export default function AddressMapModal({
  open,
  onClose,
  onConfirm,
  geocodeResult,
  fallbackPosition,
  initialPosition,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const positionRef = useRef(null);

  const initialLat =
    initialPosition?.lat ??
    geocodeResult?.latitude ??
    fallbackPosition?.latitude ??
    40.4168;
  const initialLng =
    initialPosition?.lng ??
    geocodeResult?.longitude ??
    fallbackPosition?.longitude ??
    -3.7038;

  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  useEffect(() => {
    if (open) {
      const t = setTimeout(
        () => setPosition({ lat: initialLat, lng: initialLng }),
        0,
      );
      return () => clearTimeout(t);
    }
  }, [open, initialLat, initialLng]);

  function createMarker(map) {
    const el = document.createElement("div");
    el.innerHTML = pinSvg;
    el.style.cursor = "grab";

    const marker = new maplibregl.Marker({
      element: el,
      anchor: "bottom",
      draggable: true,
    })
      .setLngLat([positionRef.current.lng, positionRef.current.lat])
      .addTo(map);

    marker.on("dragstart", () => {
      el.style.cursor = "grabbing";
    });

    marker.on("dragend", () => {
      el.style.cursor = "grab";
      const lngLat = marker.getLngLat();
      const newPos = { lat: lngLat.lat, lng: lngLat.lng };
      positionRef.current = newPos;
      setPosition(newPos);
    });

    markerRef.current = marker;
  }

  const notFoundExact = !geocodeResult;
  const lowConfidence =
    geocodeResult?.importance != null &&
    geocodeResult.importance < LOW_CONFIDENCE_THRESHOLD;

  // ──── Inicializar / destruir mapa al abrir/cerrar modal ────
  useEffect(() => {
    if (!open) return;
    console.log("[AddressMapModal] Creando mapa...");

    // Pequeno delay para que el Dialog termine su animacion y el contenedor tenga tamano
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

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
        center: [initialLng, initialLat],
        zoom: 17,
        attributionControl: false,
      });

      positionRef.current = { lat: initialLat, lng: initialLng };
      mapInstanceRef.current = map;

      map.on("load", () => {
        console.log("[AddressMapModal] Mapa cargado, agregando marker");
        createMarker(map);
      });

      map.on("error", (e) => {
        console.error("[AddressMapModal] Error del mapa:", e);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        console.log("[AddressMapModal] Destruyendo mapa");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ──── Actualizar posicion del marker cuando cambia position ────
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLngLat([position.lng, position.lat]);
  }, [position]);

  // ──── Actualizar centro cuando cambia initialLat/initialLng ────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    map.flyTo({ center: [initialLng, initialLat] });
    positionRef.current = { lat: initialLat, lng: initialLng };
  }, [initialLat, initialLng]);

  function handleConfirm() {
    onConfirm({ lat: position.lat, lng: position.lng });
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/80 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150" />

      <div className="fixed inset-0 flex h-dvh items-center justify-center font-poppins">
        <DialogPanel
          transition
          className="w-full max-w-xl h-min rounded-lg bg-white p-6 shadow-xl transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150"
        >
          <div className="mb-2 flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Confirma la ubicacion
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="shrink-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {notFoundExact && (
            <div className="mb-4 flex items-start gap-3 rounded-md bg-amber-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-xs text-slate-900">
                No pudimos localizar esa direccion exacta. Te mostramos el mapa
                centrado en la ciudad que elegiste — arrastra el pin hasta la
                ubicacion correcta.
              </p>
            </div>
          )}

          {!notFoundExact && lowConfidence && (
            <div className="mb-2 flex items-center gap-3 rounded-md bg-amber-50 p-4">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-slate-900">
                Verifica que el pin este en el lugar correcto antes de
                confirmar.
              </p>
            </div>
          )}

          <p className="mb-2 text-xs text-slate-700">
            Arrastra el pin si necesitas ajustar la ubicacion exacta.
          </p>

          <div className="mb-5 h-60 w-full overflow-hidden rounded-md border border-slate-200">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          <p className="mb-5 text-xs text-slate-500">
            Coordenadas actuales: {position.lat.toFixed(6)},{" "}
            {position.lng.toFixed(6)}
          </p>

          <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-200 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-md bg-tercero px-6 py-3 text-sm font-semibold text-primero hover:bg-tercero/80"
            >
              Confirmar ubicacion
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
