import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoArrowUp } from "react-icons/go";

const ScrollToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const progressColor = "#FF1B1C";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setIsVisible(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const size = 56;
  const strokeWidth = 3; // Grosor de la parte que se "llena" (grueso)
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-10 right-6 z-50"
          aria-label="Subir arriba"
        >
          {/* AQUÍ ESTÁ EL CAMBIO: Se agregó 'border border-[#FF1B1C]' para el borde exterior fino */}
          <div
            className="relative flex items-center justify-center rounded-full bg-red-50 border border-[#FF1B1C] shadow-lg"
            style={{ width: size, height: size }}
          >
            {/* SVG del borde circular que se llena */}
            <svg
              className="absolute inset-0 -rotate-90"
              width={size}
              height={size}
            >
              {/* Círculo de fondo (la "pista") - Sutil para no competir con el borde */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(0, 0, 0, 0.08)"
                strokeWidth={1.5}
              />

              {/* Círculo de progreso (la parte que se llena gruesa) */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={progressColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transition={{ duration: 0.1 }}
              />
            </svg>

            {/* Flecha */}
            <div className="p-3">
              <GoArrowUp className="text-3xl text-black" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
