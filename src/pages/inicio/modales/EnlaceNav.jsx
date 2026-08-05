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
  const [scrollY, setScrollY] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen && panelWidth === "full") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, panelWidth]);

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

  const basePanelClasses =
    panelWidth === "sm"
      ? "absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg border border-black/10 bg-white overflow-hidden"
      : "fixed left-0 right-0 h-[50svh] bg-white shadow-lg border-b overflow-hidden";

  const panelStyle =
    panelWidth === "full" ? { top: `calc(80px - ${scrollY}px)` } : {};

  return (
    <div className="relative inline-block">
      {/* Enlace */}
      <div
        className="relative group cursor-pointer text-sm font-semibold text-cuarto hover:text-black transition-colors"
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
          style={panelStyle}
        >
          {panelWidth === "full" ? (
            <div className="w-full mx-auto flex items-center justify-center py-5">
              <div className="w-9/12 flex gap-16">{children}</div>
            </div>
          ) : (
            <div className="w-full mx-auto flex items-center justify-center py-5">
              <div className="w-9/12 flex gap-16 ">{children}</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
