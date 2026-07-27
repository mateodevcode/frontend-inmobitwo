// src/features/seleccionar-zona/components/MapControls.jsx
export function ZoomControl({ map }) {
  if (!map) return null;

  return (
    <div className="flex flex-col overflow-hidden shadow-lg border-2 border-black/80 rounded w-min justify-end items-end">
      <button
        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 font-semibold text-gray-700 cursor-pointer text-xl"
        title="Acercar"
        onClick={() => map.zoomIn()}
      >
        +
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-xl font-semibold text-gray-700 cursor-pointer border-t-2 border-black/80"
        title="Alejar"
        onClick={() => map.zoomOut()}
      >
        −
      </button>
    </div>
  );
}

export function LocationControl({ map }) {
  if (!map) return null;

  return (
    <div className="rounded overflow-hidden shadow-lg border-2 border-black/80 bg-white">
      <button
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 cursor-pointer text-sm text-black/80 font-poppins font-semibold hover:bg-white"
        title="Tu ubicacion"
        onClick={() =>
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              console.log("[LocationControl] Ubicacion obtenida:", pos.coords);
              map.flyTo({
                center: [pos.coords.longitude, pos.coords.latitude],
                zoom: 15,
              });
            },
            (err) =>
              console.error(
                "[LocationControl] Error geolocalizacion:",
                err.message,
              ),
          )
        }
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span>Tu ubicacion</span>
      </button>
    </div>
  );
}
