// components/loader/SmartLoader.jsx
//
// Loader inteligente: solo muestra el spinner si la carga tarda más que `delay`.
// Evita el parpadeo (flicker) en cargas rápidas (< delay ms) o desde caché.
//
// Uso:
//   {loading && <SmartLoader delay={300} />}
//   {loading && <SmartLoader delay={300} label="Buscando inmuebles..." />}

import { useEffect, useState } from "react";

const SmartLoader = ({ isLoading, delay = 300, label = "Cargando..." }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => setShowSpinner(true), delay);

    return () => {
      clearTimeout(timer);
      setShowSpinner(false);
    };
  }, [isLoading, delay]);

  if (!isLoading || !showSpinner) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default SmartLoader;
