import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_SECONDS = 10;
const FADE_MS = 200;

/**
 * Encapsula todo el estado y la lógica del carrusel de fotos:
 * índice actual, transición de fade, autoplay y navegación
 * (prev/next/goTo). El componente que lo use solo se encarga de
 * renderizar la UI a partir de lo que este hook devuelve.
 */
export default function useCarruselFotos(totalImagenes, inmuebleId) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [inmuebleId]);

  const goTo = useCallback(
    (index) => {
      if (totalImagenes === 0) return;
      const next = (index + totalImagenes) % totalImagenes;
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(next);
        setFade(true);
      }, FADE_MS);
    },
    [totalImagenes],
  );

  const resetAutoPlay = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    if (totalImagenes <= 1) return;

    autoTimerRef.current = setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTOPLAY_SECONDS * 1000);
  }, [currentIndex, goTo, totalImagenes]);

  useEffect(() => {
    resetAutoPlay();
    return () => clearTimeout(autoTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handlePrev = useCallback(
    (e) => {
      e.stopPropagation();
      goTo(currentIndex - 1);
    },
    [currentIndex, goTo],
  );

  const handleNext = useCallback(
    (e) => {
      e.stopPropagation();
      goTo(currentIndex + 1);
    },
    [currentIndex, goTo],
  );

  return { currentIndex, fade, goTo, handlePrev, handleNext };
}
