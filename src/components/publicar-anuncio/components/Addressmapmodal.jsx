// src/components/publicar-anuncio/components/Addressmapmodal.jsx
//
// Modal de confirmación de ubicación. Reutiliza el patrón de Dialog de
// Headless UI v2 que ya usamos en "Nadie contacta a un anuncio sin fotos".
//
// Flujo:
//  1. El padre llama a geocode (vía tu apiBackend) y pasa el resultado aquí,
//     O pasa null si Nominatim no encontró nada (404) — en ese caso el mapa
//     se centra en las coordenadas de la CIUDAD elegida en el paso 3.
//  2. El usuario puede arrastrar el pin para ajustar.
//  3. Al confirmar, se llama onConfirm({ lat, lng }).
//
// Requiere: npm install leaflet react-leaflet

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
// El CSS de Leaflet se importa UNA VEZ en src/main.jsx, no aquí.
// Si lo importas dentro de este componente, Vite puede tree-shakearlo
// o cargarlo después del primer render, dejando el marker invisible
// (su <div> existe en el DOM pero queda con width/height: 0 sin el CSS).
import { X, AlertTriangle } from "lucide-react";

// Leaflet por defecto busca sus iconos en una ruta relativa que no existe
// en builds de Vite. En vez de depender de un PNG externo (unpkg.com puede
// fallar por CSP, ad-blockers, o problemas de red sin dar error visible),
// usamos un ícono SVG inline en un divIcon — cero dependencia de red,
// garantizado que se renderiza.
const pinSvg = `
  <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#9d174d"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>
`;

const markerIcon = L.divIcon({
  html: pinSvg,
  className: "", // evita que Leaflet aplique su clase default con background propio
  iconSize: [32, 42],
  iconAnchor: [16, 42], // la punta del pin (abajo, centrado) apunta a la coordenada exacta
});

// Umbral bajo el cual mostramos el aviso de "verifica la ubicación".
// Nominatim devuelve importance entre 0 y 1; en la práctica, matches
// de calle exacta suelen rondar 0.5-0.7, así que 0.4 es un corte razonable.
const LOW_CONFIDENCE_THRESHOLD = 0.4;

// Recentra el mapa cuando cambian las coordenadas (ej. el usuario cerró
// y reabrió el modal con una dirección distinta). También fuerza un
// recálculo de tamaño: si el modal anima su entrada (Dialog de Headless UI),
// Leaflet puede medir el contenedor como 0x0 en el primer render, dejando
// los tiles y el marker mal posicionados o invisibles.
function RecenterOnChange({ position }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.setView(position, map.getZoom());
  }, [position]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function DraggableMarker({ position, onPositionChange }) {
  const markerRef = useRef(null);

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      onPositionChange({ lat, lng });
    }
  }, [onPositionChange]);

  return (
    <Marker
      position={position}
      draggable
      icon={markerIcon}
      ref={markerRef}
      eventHandlers={{ dragend: handleDragEnd }}
    />
  );
}

export default function AddressMapModal({
  open,
  onClose,
  onConfirm,
  geocodeResult, // { latitude, longitude, displayName, importance } | null
  fallbackPosition, // { latitude, longitude } de la ciudad elegida, usado si geocodeResult es null
}) {
  // Posición inicial: el resultado de Nominatim si existe, si no la ciudad.
  const initialLat =
    geocodeResult?.latitude ?? fallbackPosition?.latitude ?? 40.4168;
  const initialLng =
    geocodeResult?.longitude ?? fallbackPosition?.longitude ?? -3.7038;

  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  // BUG CORREGIDO: useState solo usa su valor inicial en el primer render.
  // Si el modal ya estaba montado (o React reutiliza la instancia) y
  // geocodeResult/fallbackPosition cambian después — por ejemplo, el usuario
  // cierra el modal, cambia la dirección, y vuelve a abrir — el state
  // `position` se quedaba con las coordenadas viejas (el fallback de Madrid),
  // aunque el mapa visualmente sí se recentraba via `map.setView()`.
  // Este efecto vuelve a sincronizar el state cada vez que cambian los
  // props de entrada, mientras el modal esté abierto.
  useEffect(() => {
    if (open) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [open, initialLat, initialLng]);

  const notFoundExact = !geocodeResult; // Nominatim no encontró la dirección (404)
  const lowConfidence =
    geocodeResult?.importance != null &&
    geocodeResult.importance < LOW_CONFIDENCE_THRESHOLD;

  function handleConfirm() {
    onConfirm({ lat: position.lat, lng: position.lng });
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Confirma la ubicación
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

          {/* Avisos según el resultado de geocodificación */}
          {notFoundExact && (
            <div className="mb-4 flex items-start gap-3 rounded-md bg-amber-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-base text-slate-900">
                No pudimos localizar esa dirección exacta. Te mostramos el mapa
                centrado en la ciudad que elegiste — arrastra el pin hasta la
                ubicación correcta.
              </p>
            </div>
          )}

          {!notFoundExact && lowConfidence && (
            <div className="mb-4 flex items-start gap-3 rounded-md bg-amber-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-base text-slate-900">
                Verifica que el pin esté en el lugar correcto antes de
                confirmar.
              </p>
            </div>
          )}

          <p className="mb-4 text-base text-slate-700">
            Arrastra el pin si necesitas ajustar la ubicación exacta.
          </p>

          <div className="mb-5 h-96 w-full overflow-hidden rounded-md border border-slate-200">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={16}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterOnChange position={[initialLat, initialLng]} />
              <DraggableMarker
                position={position}
                onPositionChange={setPosition}
              />
            </MapContainer>
          </div>

          <p className="mb-5 text-sm text-slate-500">
            Coordenadas actuales: {position.lat.toFixed(6)},{" "}
            {position.lng.toFixed(6)}
          </p>

          <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="text-base font-semibold text-slate-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-md bg-fuchsia-800 px-6 py-3 text-base font-bold text-white hover:bg-fuchsia-900"
            >
              Confirmar ubicación
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
