import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { apiBackend } from "@/api/apiBackend";
import { mapearApiAFormDataPropiedad } from "@/hooks/useResetForm";

export const ModalContinuarAnuncio = ({ anuncio, onContinuar, onNuevo }) => {
  const {
    terminarCarga,
    iniciarCarga,
    setFormDataPropiedad,
    setContentNumber,
  } = useAppContext();

  const cargarPropiedad = async (anuncioId) => {
    try {
      iniciarCarga();
      const res = await apiBackend(`/propiedades/${anuncioId}`);
      const { success, data } = res;
      if (success) {
        localStorage.setItem(
          "ultimoAnuncioId",
          JSON.stringify({
            id: anuncioId,
            timestamp: new Date().toISOString(),
          }),
        );
        setFormDataPropiedad(mapearApiAFormDataPropiedad(data));
        setContentNumber(2);
      } else {
        localStorage.removeItem("ultimoAnuncioId");
        // navigate("/info/publicar-anuncio/publicar");
        setContentNumber(0);
      }
    } catch (error) {
      console.error("Error cargando propiedad:", error);
      setContentNumber(0);
    } finally {
      terminarCarga();
    }
  };

  useEffect(() => {
    if (anuncio.id) {
      // Hay id en la URL => flujo normal, traer datos y saltar a paso 2
      cargarPropiedad(anuncio.id);
      return;
    }
  }, [anuncio.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">
          Tienes un anuncio sin terminar
        </h3>
        <p className="text-gray-600 mb-4">
          Tienes un anuncio sin terminar del{" "}
          {new Date(anuncio.timestamp).toLocaleDateString()}. ¿Quieres continuar
          agregando las imágenes a ese anuncio?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onNuevo}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700"
          >
            No, quiero uno nuevo
          </button>
          <button
            onClick={onContinuar}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Sí, continuar
          </button>
        </div>
      </div>
    </div>
  );
};
