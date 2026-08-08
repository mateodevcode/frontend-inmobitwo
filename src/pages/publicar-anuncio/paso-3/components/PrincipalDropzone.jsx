import { useRef, useState } from "react";
import { Plus, HardDriveUpload, Image as ImageIcon, Star } from "lucide-react";

const PrincipalDropzone = ({ preview, onFileSelected }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative h-72 flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging ? "border-tercero bg-tercero" : "border-slate-300"
        }`}
      >
        <div className="rounded-md border border-slate-200 p-3">
          <HardDriveUpload className="h-7 w-7 text-tercero" />
        </div>
        <p className="text-base text-slate-900">
          Arrastra y suelta tu foto principal aquí
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-md bg-tercero px-5 py-3 text-base font-semibold text-white hover:bg-tercero active:scale-[0.99] cursor-pointer select-none"
        >
          <Plus className="h-5 w-5" />
          Elegir foto principal
        </button>
      </div>

      <div className="h-72 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Vista previa de la foto principal"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Principal
            </span>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="mx-auto mb-2 w-fit rounded-md border border-slate-200 p-2">
              <ImageIcon className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm">La foto principal aparecerá aquí</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalDropzone;
