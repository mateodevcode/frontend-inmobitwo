import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { logo } from "@/data/logo";

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
        className="bg-stone-50 cursor-pointer select-none"
        id="top-detalles"
        onClick={() => navigate("/")}
      >
        <div className="px-6 py-5 md:px-10 flex items-center gap-4">
          <div className="border-black/10 border rounded-xl w-10 h-10 flex items-center justify-center shadow-xl">
            <img src={logo.src} alt={logo.alt} width={25} height={25} />
          </div>
          <span className="font-montserrat text-2xl font-bold tracking-tight text-black md:text-3xl">
            inmobitwo
          </span>
        </div>
      </div>

      {/* Navegación de pasos con flechas */}
      <nav
        aria-label="Progreso del anuncio"
        className="flex w-full border-b border-neutral-200 bg-white font-poppins sticky top-0 z-50"
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
