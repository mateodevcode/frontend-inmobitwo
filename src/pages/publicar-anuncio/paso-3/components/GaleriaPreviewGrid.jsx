import { Star, X } from "lucide-react";

const GaleriaPreviewGrid = ({ previews, onDelete, onMakePrincipal }) => {
  if (previews.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="relative group rounded-md overflow-hidden border border-slate-200 hover:border-tercero transition-colors"
        >
          <img
            src={preview.url}
            alt={`Vista previa ${index + 1}`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 flex items-start justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <button
              type="button"
              onClick={() => onMakePrincipal?.(index)}
              title="Usar como foto principal"
              className="rounded-full bg-white/90 p-1.5 hover:bg-white text-amber-500"
            >
              <Star className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              title="Eliminar"
              className="rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
            {preview.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GaleriaPreviewGrid;
