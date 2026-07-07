import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlOptions } from "react-icons/sl";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const MenuOpciones = ({ onVer, onEditar, onEliminar }) => {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const opciones = [
    {
      label: "Ver",
      icon: <FiEye className="text-base" />,
      onClick: onVer,
      color: "text-black",
    },
    {
      label: "Editar",
      icon: <FiEdit2 className="text-base" />,
      onClick: onEditar,
      color: "text-black",
    },
    {
      label: "Eliminar",
      icon: <FiTrash2 className="text-base" />,
      onClick: onEliminar,
      color: "text-red-600",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setAbierto((prev) => !prev)}
        className="p-2.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        <SlOptions className="text-black" />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1 w-40 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-50 origin-top-right"
          >
            {opciones.map((op, i) => (
              <button
                key={i}
                onClick={() => {
                  op.onClick?.();
                  setAbierto(false);
                }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-medium hover:bg-black/5 transition cursor-pointer ${op.color}`}
              >
                {op.icon}
                <span>{op.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuOpciones;
