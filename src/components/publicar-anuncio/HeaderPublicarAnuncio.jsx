import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { useAppContext } from "@/context/AppContext";
import Logo from "../logo/Logo";

const steps = [
  { id: 0, label: "1. Datos básicos" },
  { id: 1, label: "2. Detalles" },
  { id: 2, label: "3. Fotos" },
];

const ARROW_STRAIGHT =
  "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%)";
const ARROW_NOTCHED =
  "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%, 22px 50%)";

const HeaderPublicarAnuncio = () => {
  const { contentNumber } = useAppContext();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <>
      {/* Barra del logo */}
      <div
        className="bg-primero cursor-pointer select-none"
        id="top-detalles"
        onClick={() => navigate("/")}
      >
        <div className="w-full flex items-center justify-center">
          <div className="py-5 w-11/12">
            <Logo />
          </div>
        </div>
      </div>

      {/* Navegación de pasos con flechas */}
      <nav
        aria-label="Progreso del anuncio"
        className="grid grid-cols-1 md:grid-cols-3 w-full border-b border-t border-neutral-200 bg-white font-poppins sticky top-0 z-50"
      >
        {steps.map((step, index) => {
          const isActive = step.id === contentNumber;
          const isCompleted = step.id < contentNumber;
          const isFirst = index === 0;

          return (
            <div
              key={step.id}
              className={`relative flex flex-1 items-center gap-2 md:justify-center px-4 py-5 text-base font-semibold md:py-6 md:text-lg ${
                isActive
                  ? "bg-black text-white"
                  : isCompleted
                    ? "bg-white text-green-600"
                    : "bg-white text-neutral-400"
              }`}
              style={
                isActive
                  ? {
                      clipPath:
                        isMobile || isFirst ? ARROW_STRAIGHT : ARROW_NOTCHED,
                    }
                  : undefined
              }
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted && (
                <FaCircleCheck size={20} strokeWidth={3} className="shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default HeaderPublicarAnuncio;
