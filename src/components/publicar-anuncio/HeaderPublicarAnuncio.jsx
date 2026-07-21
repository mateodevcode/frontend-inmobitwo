import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { irArriba } from "../../utils/irArriba";

const steps = [
  { id: 0, label: "1. Datos básicos" },
  { id: 1, label: "2. Detalles" },
  { id: 2, label: "3. Fotos" },
];

const HeaderPublicarAnuncio = () => {
  const { contentNumber } = useAppContext();
  const navigate = useNavigate();

  return (
    <>
      {/* Barra del logo */}
      <div
        className="bg-primero cursor-pointer select-none"
        id="top-detalles"
        onClick={() => navigate("/")}
      >
        <div className="w-full flex items-center justify-center">
          <div
            className="flex items-center gap-2 select-none py-5 w-11/12"
            onClick={() => {
              navigate("/");
              irArriba();
            }}
          >
            <div className="w-9 h-9">
              <img
                src="/logo/logo.png"
                alt="logo inmobitwo"
                className="object-center w-full h-full"
              />
            </div>
            <span className="text-2xl md:text-3xl tracking-tight text-black font-bold font-poppins">
              inmobitwo
            </span>
          </div>
        </div>
      </div>

      {/* Navegación de pasos con flechas */}
      <nav
        aria-label="Progreso del anuncio"
        className="flex w-full border-b border-t border-neutral-200 bg-white font-poppins sticky top-0 z-50"
      >
        {steps.map((step, index) => {
          const isActive = step.id === contentNumber;
          const isFirst = index === 0;
          return (
            <div
              key={step.id}
              className={`relative flex flex-1 items-center justify-center px-4 py-5 text-base font-semibold md:py-6 md:text-lg ${
                isActive ? "bg-black text-white" : "bg-white text-neutral-400"
              }`}
              style={
                isActive
                  ? {
                      clipPath: isFirst
                        ? "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%)"
                        : "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%, 22px 50%)",
                    }
                  : undefined
              }
              aria-current={isActive ? "step" : undefined}
            >
              {step.label}
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default HeaderPublicarAnuncio;
