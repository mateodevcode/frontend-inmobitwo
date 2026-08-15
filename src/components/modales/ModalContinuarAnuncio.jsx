// src/components/modales/ModalContinuarAnuncio.jsx
//
// Modal presentacional: pregunta si continuar el anuncio guardado o empezar uno
// nuevo. No hace fetch por sí mismo; al continuar se navega a ?id= y el resto
// lo resuelve PublicarAnuncio (cargarPropiedad).

export const ModalContinuarAnuncio = ({ anuncio, onContinuar, onNuevo }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-poppins">
      <div className="bg-white rounded-md p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2 text-black/70">
          Tienes un anuncio sin terminar
        </h3>
        <p className="text-segundo/50 mb-4">
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
            className="px-4 py-2 rounded bg-blue-600 text-white text-base"
          >
            Sí, continuar
          </button>
        </div>
      </div>
    </div>
  );
};
