import PropertyImage from "@/components/common/PropertyImage";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useCarruselFotos from "@/hooks/useCarruselFotos";

const GaleriaInmuebles = ({ totalImagenes, fotos, inmueble }) => {
  const navigate = useNavigate();

  const { currentIndex, fade, goTo, handlePrev, handleNext } = useCarruselFotos(
    totalImagenes,
    inmueble?.id,
  );

  return (
    <div className="relative w-full h-105 bg-gray-100 overflow-hidden">
      {totalImagenes > 0 && (
        <PropertyImage
          foto={fotos[currentIndex]}
          tamañoBase="large"
          sizes="(max-width: 768px) 100vw, 800px"
          alt={inmueble.titulo}
          className="w-full h-full object-cover select-none cursor-pointer"
          onClick={() =>
            navigate(`/inmueble/${inmueble.id}/foto/${currentIndex + 1}`)
          }
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {totalImagenes > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-3 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {totalImagenes > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-2 rounded">
          {currentIndex + 1}/{totalImagenes}
        </div>
      )}

      {totalImagenes > 1 && (
        <>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex w-9 h-9 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-xl cursor-pointer select-none active:scale-95 duration-300 transition"
          >
            <MdOutlineKeyboardArrowRight />
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex w-9 h-9 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-xl cursor-pointer select-none active:scale-95 duration-300 transition"
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
        </>
      )}
    </div>
  );
};

export default GaleriaInmuebles;
