import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { X } from "lucide-react";

const NoPhotosWarningModal = ({
  open,
  onClose,
  onAddPhotosNow,
  onContinueAnyway,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 font-poppins">
      <DialogBackdrop className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
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
              className="rounded-md bg-tercero px-5 py-3 text-sm md:text-base font-semibold text-white hover:bg-tercero cursor-pointer select-none"
            >
              Añadir fotos
            </button>
            <button
              type="button"
              onClick={onContinueAnyway}
              disabled={loading}
              className="text-sm md:text-base font-semibold text-blue-600 hover:underline cursor-pointer select-none disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Continuar sin fotos"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NoPhotosWarningModal;
