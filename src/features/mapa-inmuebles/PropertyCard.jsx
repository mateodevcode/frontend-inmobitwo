import { formatPrecioCompleto } from "@/utils/formatPrecio";

export function PropertyCard({
  inmueble,
  imagenIndex,
  onNext,
  onPrev,
  onClose,
}) {
  const imagenes = inmueble.imagenes?.length
    ? inmueble.imagenes
    : inmueble.imagen_principal_url
      ? [inmueble.imagen_principal_url]
      : [];
  const imagenActual = imagenes[imagenIndex];

  return (
    <div className="absolute bottom-4 left-4 z-1000 w-72 bg-white rounded-lg shadow-xl overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-white"
      >
        ✕
      </button>

      <div className="relative w-full h-40 bg-gray-100">
        {imagenActual && (
          <img
            src={imagenActual}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        {imagenes.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white"
            >
              ›
            </button>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              {imagenIndex + 1}/{imagenes.length}
            </span>
          </>
        )}
      </div>

      <div className="p-3">
        <p className="text-lg font-bold text-[#e6007a] mb-1">
          {formatPrecioCompleto(inmueble.precio)}
        </p>
        <p className="text-sm text-gray-800 mb-1">
          {inmueble.titulo || "Sin título"}
        </p>
        <p className="text-xs text-gray-500">
          {inmueble.operacion} · {inmueble.tipo}
        </p>
      </div>
    </div>
  );
}
