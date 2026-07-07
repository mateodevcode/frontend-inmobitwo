// src/components/ConsentimientoBanner.jsx
import { useAppContext } from "@/context/AppContext";
import useTracking from "@/hooks/useTracking";

const ConsentimientoBanner = () => {
  const { consentimientoTracking, aceptarTracking, rechazarTracking } =
    useAppContext();
  const { registrarSesion } = useTracking();

  // Ya respondió antes (aceptó o rechazó) → no mostrar nada
  if (consentimientoTracking !== null) return null;

  const handleAceptar = async () => {
    aceptarTracking();
    // Registrar sesión justo después de aceptar (no antes, por respeto al consentimiento)
    setTimeout(() => registrarSesion(), 0);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-black/10 shadow-lg p-4 md:p-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
        <p className="text-sm text-black/70 text-center md:text-left">
          Usamos cookies y datos de navegación para mejorar tu experiencia y
          ayudar a los anunciantes a contactarte si muestras interés en una
          propiedad. Puedes aceptar o rechazar este seguimiento.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={rechazarTracking}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-black/20 hover:bg-black/5 transition"
          >
            Rechazar
          </button>
          <button
            onClick={handleAceptar}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentimientoBanner;
