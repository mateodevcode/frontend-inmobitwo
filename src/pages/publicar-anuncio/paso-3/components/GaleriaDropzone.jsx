import { useRef, useState } from "react";
import {
  Plus,
  Image as ImageIcon,
  FileText,
  Camera,
} from "lucide-react";

const GaleriaDropzone = ({
  titulo = "Galería de fotos",
  onFilesSelected,
  count,
  max = 10,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onFilesSelected(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-base font-semibold text-slate-900">{titulo}</p>
        <span className="text-sm text-slate-400">
          {count} / {max} fotos
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center gap-3 rounded-md border-2 border-dashed px-8 py-8 text-center transition-colors ${
          isDragging ? "border-tercero bg-tercero" : "border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3 text-tercero">
          <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
          <FileText className="h-10 w-10" strokeWidth={1.5} />
          <Camera className="h-10 w-10" strokeWidth={1.5} />
        </div>
        <p className="text-base text-slate-900">
          Arrastra y suelta más fotos o planos aquí
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-md bg-tercero px-6 py-3 text-base font-semibold text-white hover:bg-tercero active:scale-[0.99] cursor-pointer select-none"
        >
          <Plus className="h-5 w-5" />
          Añadir a la galería
        </button>
      </div>
    </div>
  );
};

export default GaleriaDropzone;
