import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlinePhotoCamera,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AUTOPLAY_SECONDS = 10;

const ImagenesCard = ({ propiedades }) => {
  const {
    id,
    titulo,
    imagen_principal_url,
    estado,
    galeria = [],
  } = propiedades;

  const navigate = useNavigate();
  const [fade, setFade] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const imagenes = [
    imagen_principal_url,
    ...galeria
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
  ].filter(Boolean);

  const totalImagenes = imagenes.length;

  const goTo = useCallback(
    (index) => {
      const next = (index + totalImagenes) % totalImagenes;
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(next);
        setFade(true);
      }, 200);
    },
    [totalImagenes],
  );

  const resetAutoPlay = useCallback(() => {
    // Limpiar timers anteriores
    clearTimeout(autoTimerRef.current);
    clearInterval(progressIntervalRef.current);

    setProgress(0);

    if (totalImagenes <= 1) return;

    // Progress bar tick cada 100ms
    let elapsed = 0;
    progressIntervalRef.current = setInterval(() => {
      elapsed += 100;
      setProgress((elapsed / (AUTOPLAY_SECONDS * 1000)) * 100);
    }, 100);

    // Auto-avance cada 10s
    autoTimerRef.current = setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTOPLAY_SECONDS * 1000);
  }, [currentIndex, goTo, totalImagenes]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      clearTimeout(autoTimerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex]); // eslint-disable-line

  const handlePrev = (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  };

  return (
    <div className="relative">
      {/* Imagen con fade */}
      <img
        src={imagenes[currentIndex]}
        alt={titulo}
        onClick={() => navigate(`/inmueble/${id}`)}
        className="w-full h-72 object-cover cursor-pointer"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Progress bar */}
      {totalImagenes > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
          <div
            className="h-full bg-white/80 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Badge fotos */}
      <div className="flex bg-black/50 absolute text-white text-xs px-2 py-1.5 rounded-md items-center gap-2 top-2 left-2">
        <MdOutlinePhotoCamera />
        <span>
          {currentIndex + 1} / {totalImagenes}{" "}
          {totalImagenes === 1 ? "foto" : "fotos"}
        </span>
      </div>

      {/* icons */}
      <div className="flex bg-white absolute text-black text-xs px-4 py-1.5 rounded-full items-center gap-2 top-2 right-2 font-semibold">
        {estado}
      </div>
      <div className="flex bg-black absolute text-white px-4 py-2 rounded-md items-center gap-2 bottom-2 left-2 font-bold font-montserrat">
        $ 250.000
      </div>

      {/* Dots indicadores */}
      {totalImagenes > 1 && (
        <div className="absolute bottom-4 right-2 flex gap-1.5 items-center">
          {imagenes.map((_, i) => (
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

      {/* Botones prev / next — solo si hay más de 1 imagen */}
      {totalImagenes > 1 && (
        <>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              onClick={handleNext}
              className="flex w-10 h-10 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-2xl cursor-pointer select-none active:scale-95 duration-300 transition"
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <button
              onClick={handlePrev}
              className="flex w-10 h-10 hover:bg-white bg-white/70 text-black rounded-full items-center justify-center text-2xl cursor-pointer select-none active:scale-95 duration-300 transition"
            >
              <MdOutlineKeyboardArrowLeft />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagenesCard;
