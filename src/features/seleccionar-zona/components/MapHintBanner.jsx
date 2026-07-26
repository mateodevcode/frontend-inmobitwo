// src/features/seleccionar-zona/components/MapHintBanner.jsx
import { useEffect, useState } from "react";

const AUTO_DISMISS_MS = 3000;
const EXIT_DURATION_MS = 300;

export default function MapHintBanner() {
  const [visible, setVisible] = useState(false); // controla montaje real
  const [entered, setEntered] = useState(false); // controla animación in/out

  useEffect(() => {
    setVisible(true);
    // Doble rAF para asegurar que el navegador pinte el estado inicial
    // antes de aplicar la clase de "entrada" (si no, la transición no se ve).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });

    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(autoCloseTimer);
  }, []);

  function handleClose() {
    setEntered(false); // dispara animación de salida
    setTimeout(() => setVisible(false), EXIT_DURATION_MS);
  }

  if (!visible) return null;

  return (
    <div
      className={`absolute top-4 left-1/2 z-1100 -translate-x-1/2 transition-all ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
      }`}
      style={{
        transitionDuration: entered ? "500ms" : `${EXIT_DURATION_MS}ms`,
        transitionTimingFunction: entered
          ? "cubic-bezier(0.34, 1.56, 0.64, 1)" // easing tipo spring (con rebote)
          : "ease-in",
      }}
    >
      <div className="flex items-center gap-3 bg-[#1a1a1a]/90 text-white text-sm px-5 py-3 rounded shadow-lg whitespace-nowrap">
        <span>
          Haz zoom en el mapa para seleccionar las zonas que te interesan
        </span>
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/20 shrink-0"
          title="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
