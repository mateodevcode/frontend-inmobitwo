import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import usePropiedades from "@/hooks/usePropiedades";

const ModalConfirmarEliminarPropiedad = () => {
  const {
    openModalConfirmarEliminarPropiedad,
    setOpenModalConfirmarEliminarPropiedad,
    propiedadAEliminar,
    eliminandoPropiedad,
    setPropiedadAEliminar,
  } = useAppContext();
  const { eliminarPropiedad } = usePropiedades();

  const cerrarModal = () => {
    if (eliminandoPropiedad) return; // evita cerrar mientras está eliminando
    setOpenModalConfirmarEliminarPropiedad(false);
    setPropiedadAEliminar(null);
  };

  useEffect(() => {
    if (openModalConfirmarEliminarPropiedad) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModalConfirmarEliminarPropiedad]);

  return (
    <AnimatePresence>
      {openModalConfirmarEliminarPropiedad && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 font-poppins p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={cerrarModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <FiAlertTriangle className="text-2xl" />
              </div>

              <h3 className="font-semibold text-black text-lg">
                ¿Eliminar esta propiedad?
              </h3>
              <p className="text-sm text-black/60 mt-1.5">
                Se eliminarán también todas las imágenes asociadas. Esta acción
                no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={cerrarModal}
                disabled={eliminandoPropiedad}
                className="flex-1 py-2.5 rounded-md border border-black/15 font-medium text-sm text-black hover:bg-black/5 transition cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-2.5 rounded-md bg-red-600 hover:bg-red-700 font-medium text-sm text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                type="button"
                onClick={() => eliminarPropiedad(propiedadAEliminar)}
                disabled={eliminandoPropiedad}
              >
                {eliminandoPropiedad ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Sí, eliminar"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalConfirmarEliminarPropiedad;
