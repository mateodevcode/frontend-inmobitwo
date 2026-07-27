import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import {
  Plus,
  ChevronLeft,
  Info,
  X,
  Image as ImageIcon,
  FileText,
  Camera,
  HardDriveUpload,
  Star,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import usePropiedades from "@/hooks/usePropiedades";

/* ============================================================
   DROPZONE — Imagen principal (1 archivo)
   ============================================================ */
function PrincipalDropzone({ preview, onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onFileSelected(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Columna 1: dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative h-72 flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging ? "border-rose-500 bg-rose-50" : "border-slate-300"
        }`}
      >
        <div className="rounded-md border border-slate-200 p-3">
          <HardDriveUpload className="h-7 w-7 text-rose-600" />
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
          className="flex items-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-base font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
        >
          <Plus className="h-5 w-5" />
          Elegir foto principal
        </button>
      </div>

      {/* Columna 2: preview */}
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
}

/* ============================================================
   DROPZONE — Galería (múltiples archivos)
   ============================================================ */
function GaleriaDropzone({ onFilesSelected, count, max = 10 }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onFilesSelected(files);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [onFilesSelected],
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-base font-semibold text-slate-900">
          Galería de fotos
        </p>
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
          isDragging ? "border-rose-500 bg-rose-50" : "border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3 text-rose-600">
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
          className="flex items-center gap-2 rounded-md bg-rose-600 px-6 py-3 text-base font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
        >
          <Plus className="h-5 w-5" />
          Añadir a la galería
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   GRID de previews de la galería, con opción de eliminar
   y de "hacer principal"
   ============================================================ */
function GaleriaPreviewGrid({ previews, onDelete, onMakePrincipal }) {
  if (previews.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="relative group rounded-md overflow-hidden border border-slate-200 hover:border-rose-500 transition-colors"
        >
          <img
            src={preview.url}
            alt={`Vista previa ${index + 1}`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 flex items-start justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <button
              type="button"
              onClick={() => onMakePrincipal(index)}
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
}

/* ============================================================
   BANNER informativo (azul)
   ============================================================ */
function InfoBannerBlue({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3.5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 fill-blue-600 text-blue-50" />
      <p className="text-base text-slate-900">{children}</p>
    </div>
  );
}

/* ============================================================
   "Ten en cuenta que..." — lista de tips con icono
   ============================================================ */
function TipsList({ title, tips }) {
  return (
    <div className="rounded-md border border-slate-200 px-5 py-5">
      <h3 className="mb-4 text-xl font-bold text-slate-900">{title}</h3>
      <ul className="flex flex-col gap-4">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <tip.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-slate-700"
              strokeWidth={1.75}
            />
            <p className="text-base text-slate-900">{tip.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   FOOTER de navegación del wizard (Volver / Continuar)
   ============================================================ */
function WizardFooter({ onBack, onContinue, loading, continueLabel }) {
  return (
    <div className="fixed bottom-0 w-full bg-white left-0">
      <div className="flex items-center justify-between border-t border-slate-200 p-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-lg text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft className="h-5 w-5" />
          Volver
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          className="rounded-md border-2 border-rose-500 px-6 py-3 text-lg font-bold text-rose-600 hover:bg-rose-50 active:scale-[0.99] cursor-pointer select-none disabled:opacity-50"
        >
          {loading ? "Guardando..." : continueLabel}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MODAL informativo: "Nadie contacta a un anuncio sin fotos"
   ============================================================ */
function NoPhotosWarningModal({
  open,
  onClose,
  onAddPhotosNow,
  onContinueAnyway,
  loading,
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Nadie contacta a un anuncio sin fotos
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

          <p className="mb-2 text-base text-slate-900">
            No hay segunda oportunidad para una primera impresión. Sin fotos tu
            anuncio{" "}
            <strong>
              tendrá menos visitas y menos contactos que los anuncios que sí
              tienen.
            </strong>
          </p>
          <p className="mb-6 text-base text-slate-900">
            ¿Seguro que quieres continuar sin añadir fotos?
          </p>

          <div className="flex items-center gap-6 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onAddPhotosNow}
              className="rounded-md bg-rose-600 px-5 py-3 text-base font-bold text-white hover:bg-rose-500 cursor-pointer select-none"
            >
              Añadir fotos ahora
            </button>
            <button
              type="button"
              onClick={onContinueAnyway}
              disabled={loading}
              className="text-base font-semibold text-blue-600 hover:underline cursor-pointer select-none disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Continuar sin fotos"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* ============================================================
   TIPS
   ============================================================ */
const TIPS = [
  {
    icon: ImageIcon,
    text: (
      <>
        Las fotos, planos y vídeos{" "}
        <strong>atraen más interesados a tu anuncio</strong>
      </>
    ),
  },
  {
    icon: FileText,
    text: (
      <>
        Si tienes un <strong>plano del inmueble,</strong> puedes hacerle una
        foto o dibujar uno a mano y hacer una foto del dibujo
      </>
    ),
  },
  {
    icon: Camera,
    text: (
      <>
        Al hacer tus fotos, asegúrate de que cada habitación esté{" "}
        <strong>ordenada, limpia y bien iluminada</strong>
      </>
    ),
  },
];

/* ============================================================
   PANTALLA COMPLETA
   ============================================================ */
export default function AddPhotosStep() {
  const { setContentNumber } = useAppContext();
  const { subirFotosAnuncio, continuarSinFotos } = usePropiedades();
  const [searchParams] = useSearchParams();
  const anuncioId = searchParams.get("id");

  // Imagen principal
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [previewPrincipal, setPreviewPrincipal] = useState(null);

  // Galería
  const [galeriaFiles, setGaleriaFiles] = useState([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState([]);

  // Planos
  const [planosFiles, setPlanosFiles] = useState([]);
  const [planosPreviews, setPlanosPreviews] = useState([]);

  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const hayFotos = !!imagenPrincipal || galeriaFiles.length > 0 || planosFiles.length > 0;

  // ─────────────────────────────────────────────
  // Imagen principal: validar + setear
  // ─────────────────────────────────────────────
  const handlePrincipalSelected = (file) => {
    if (file.size > 10 * 1024 * 1024) return;
    setImagenPrincipal(file);
    setPreviewPrincipal(URL.createObjectURL(file));
  };

  // ─────────────────────────────────────────────
  // Galería: agregar archivos
  // La primera foto que se sube en TODO el flujo (si no hay
  // principal aún) se vuelve automáticamente la principal.
  // ─────────────────────────────────────────────
  const handleGaleriaFilesSelected = (files) => {
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      validFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), name: file.name });
    }

    if (validFiles.length === 0) return;

    // Si todavía no hay imagen principal, la primera de este lote la asume
    if (!imagenPrincipal) {
      const [primera, ...resto] = validFiles;
      const [previewPrimera, ...previewResto] = newPreviews;

      setImagenPrincipal(primera);
      setPreviewPrincipal(previewPrimera.url);

      setGaleriaFiles((prev) => [...prev, ...resto]);
      setGaleriaPreviews((prev) => [...prev, ...previewResto]);
      return;
    }

    setGaleriaFiles((prev) => {
      const total = prev.length + validFiles.length;
      if (total > 10) return prev;
      return [...prev, ...validFiles];
    });
    setGaleriaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteGaleriaPreview = (index) => {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ─────────────────────────────────────────────
  // Planos: agregar archivos (no se vuelven principal)
  // ─────────────────────────────────────────────
  const handlePlanosFilesSelected = (files) => {
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      validFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), name: file.name });
    }

    if (validFiles.length === 0) return;

    setPlanosFiles((prev) => {
      const total = prev.length + validFiles.length;
      if (total > 10) return prev;
      return [...prev, ...validFiles];
    });
    setPlanosPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeletePlanoPreview = (index) => {
    setPlanosFiles((prev) => prev.filter((_, i) => i !== index));
    setPlanosPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Convierte una foto de la galería en la principal (swap)
  const handleMakePrincipal = (index) => {
    const nuevaPrincipalFile = galeriaFiles[index];
    const nuevaPrincipalPreview = galeriaPreviews[index];

    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));

    if (imagenPrincipal) {
      setGaleriaFiles((prev) => [...prev, imagenPrincipal]);
      setGaleriaPreviews((prev) => [
        ...prev,
        { url: previewPrincipal, name: "principal-anterior" },
      ]);
    }

    setImagenPrincipal(nuevaPrincipalFile);
    setPreviewPrincipal(nuevaPrincipalPreview.url);
  };

  // ─────────────────────────────────────────────
  // Continuar
  // ─────────────────────────────────────────────
  const handleContinueClick = () => {
    if (!hayFotos) {
      setShowWarning(true);
      return;
    }
    subirFotosAnuncio(anuncioId, setLoading, imagenPrincipal, galeriaFiles, planosFiles);
  };

  const handleBack = () => {
    setContentNumber(1);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6 font-montserrat relative mb-40">
      <div className="rounded-lg p-8">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">
          Añadir fotos a tu anuncio
        </h2>
        <p className="mb-6 text-base text-slate-500">
          La primera foto que subas será tu foto principal — puedes cambiarla
          más tarde marcando otra con la estrella.
        </p>

        <PrincipalDropzone
          preview={previewPrincipal}
          onFileSelected={handlePrincipalSelected}
        />

        <div className="mt-8">
          <GaleriaDropzone
            onFilesSelected={handleGaleriaFilesSelected}
            count={galeriaFiles.length}
          />
          <GaleriaPreviewGrid
            previews={galeriaPreviews}
            onDelete={handleDeleteGaleriaPreview}
            onMakePrincipal={handleMakePrincipal}
          />
        </div>

        <div className="mt-8">
          <GaleriaDropzone
            onFilesSelected={handlePlanosFilesSelected}
            count={planosFiles.length}
          />
          <GaleriaPreviewGrid
            previews={planosPreviews}
            onDelete={handleDeletePlanoPreview}
            onMakePrincipal={() => {}}
          />
        </div>
      </div>

      <InfoBannerBlue>
        Selecciona hasta <strong>40 fotos y 10 planos</strong> (máx. 32 MB cada
        uno) de tu galería.
      </InfoBannerBlue>

      <TipsList title="Ten en cuenta que..." tips={TIPS} />

      <WizardFooter
        onBack={handleBack}
        onContinue={handleContinueClick}
        loading={loading}
        continueLabel={hayFotos ? "Guardar y continuar" : "Continuar sin fotos"}
      />

      <NoPhotosWarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        loading={loading}
        onAddPhotosNow={() => setShowWarning(false)}
        onContinueAnyway={() => {
          setShowWarning(false);
          continuarSinFotos();
        }}
      />
    </div>
  );
}
