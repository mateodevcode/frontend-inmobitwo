"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function EnlaceNav({
  title,
  children,
  panelWidth = "full",
  panelClassName = "",
  closeDelay = 150,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Solo bloqueamos el scroll del body cuando es el mega menú de pantalla
    // completa; un popup chico no necesita frenar el scroll de la página.
    if (isOpen && panelWidth === "full") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, panelWidth]);

  useEffect(() => {
    if (panelWidth !== "full") return; // el scroll-shrink solo aplica al mega menú
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [panelWidth]);

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const scheduleClose = () => {
    timeoutRef.current = setTimeout(close, closeDelay);
  };

  const enterCard = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const leaveCard = () => close();

  // Presets de tamaño/posición según panelWidth. panelClassName siempre
  // se agrega al final, así que puede overridear cualquiera de estas clases
  // si hace falta un caso puntual distinto.
  const basePanelClasses =
    panelWidth === "sm"
      ? "absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg border border-black/10 bg-white overflow-hidden"
      : `fixed left-0 right-0 ${
          scrolled ? "top-14" : "top-20"
        } h-[50svh] bg-white shadow-lg border-b overflow-hidden`;

  return (
    <div className="relative inline-block">
      {/* Enlace */}
      <div
        className="relative group cursor-pointer text-base font-semibold text-cuarto hover:text-black transition-colors"
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
      >
        {title}
        <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-tercero transition-all duration-300 group-hover:w-full" />
      </div>

      {/* Panel (hover card) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          onMouseEnter={enterCard}
          onMouseLeave={leaveCard}
          className={`${basePanelClasses} z-50 ${panelClassName}`}
        >
          {panelWidth === "full" ? (
            <div className="w-full mx-auto flex items-center justify-center">
              <div className="w-9/12 flex gap-16">{children}</div>
            </div>
          ) : (
            <div className="w-full mx-auto flex items-center justify-center">
              <div className="w-9/12 flex gap-16 ">{children}</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
