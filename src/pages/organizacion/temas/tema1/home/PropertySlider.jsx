import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PiBuildingApartmentThin,
  PiHouseLineThin,
  PiMapPinAreaThin,
  PiBuildingsThin,
  PiBuildingOfficeThin,
  PiHouseSimpleThin,
} from "react-icons/pi";

// Cada tipo con su propio icono para que se distingan a simple vista
const propertyTypes = [
  {
    id: 1,
    icon: PiBuildingApartmentThin,
    title: "Apartment",
    count: "12 Property",
  },
  { id: 2, icon: PiHouseLineThin, title: "House", count: "10 Property" },
  { id: 3, icon: PiMapPinAreaThin, title: "Land/Plot", count: "02 Property" },
  { id: 4, icon: PiBuildingsThin, title: "Townhouse", count: "05 Property" },
  {
    id: 5,
    icon: PiBuildingOfficeThin,
    title: "Penthouse",
    count: "02 Property",
  },
  { id: 6, icon: PiHouseSimpleThin, title: "Cottage", count: "11 Property" },
];

const AUTOPLAY_MS = 5000;

// Cuántas cards según el ancho de pantalla
const getItemsPerView = (width) => {
  if (width < 640) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  return 6;
};

const PropertySlider = () => {
  const [itemsPerView, setItemsPerView] = useState(() =>
    typeof window !== "undefined" ? getItemsPerView(window.innerWidth) : 6,
  );

  // activeIndex: cuál card está resaltada -> maneja autoplay, click y dots (uno por card)
  const [activeIndex, setActiveIndex] = useState(2); // arranca en "Land/Plot", como en la imagen
  const [isPaused, setIsPaused] = useState(false);

  // Índice máximo al que puede "scrollear" el track sin dejar hueco vacío
  const maxIndex = useMemo(
    () => Math.max(0, propertyTypes.length - itemsPerView),
    [itemsPerView],
  );

  // El track solo se mueve lo necesario para mantener la card activa visible;
  // si activeIndex ya cabe en pantalla (ej. desktop con las 6 visibles), el track no se mueve
  const scrollIndex = Math.min(activeIndex, maxIndex);

  // Ajusta itemsPerView al redimensionar
  useEffect(() => {
    const handleResize = () =>
      setItemsPerView(getItemsPerView(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay: cambia la card resaltada cada 5s y, al llegar a la última, vuelve a la primera
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) =>
        prev >= propertyTypes.length - 1 ? 0 : prev + 1,
      );
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = useCallback((index) => setActiveIndex(index), []);

  return (
    <div
      className="bg-stone-50 w-full min-h-[70svh] flex flex-col justify-center py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-10 h-6 flex flex-col gap-1 items-end justify-center">
              <div className="h-0.5 w-3 bg-black" />
              <div className="h-0.5 w-6 bg-rose-600" />
            </div>
            <h3 className="text-rose-600 text-lg font-semibold uppercase">
              Categorias
            </h3>
            <div className="w-10 h-6 flex flex-col gap-1 justify-center">
              <div className="h-0.5 w-3 bg-black" />
              <div className="h-0.5 w-6 bg-rose-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Choose Your Property Type
          </h2>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${scrollIndex * (100 / itemsPerView)}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {propertyTypes.map((property, index) => {
              const Icon = property.icon;
              const isActive = index === activeIndex;

              return (
                <div
                  key={property.id}
                  className="flex-shrink-0 cursor-pointer"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${(6 * (itemsPerView - 1)) / itemsPerView}px)`,
                  }}
                  onClick={() => goToSlide(index)}
                >
                  <div
                    className={`rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center transition-colors duration-300 ${
                      isActive
                        ? "bg-red-500 text-white shadow-xl"
                        : "bg-stone-100 text-gray-900"
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-white">
                      <Icon className="text-4xl text-gray-900" />
                    </div>

                    <h3 className="text-xl font-semibold mb-1">
                      {property.title}
                    </h3>
                    <p
                      className={`text-sm ${isActive ? "text-red-100" : "text-gray-500"}`}
                    >
                      {property.count}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Dots: uno por cada card, proporcional a la cantidad de imágenes */}
        <div className="flex justify-center gap-3 mt-10">
          {propertyTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 rounded-full ${
                index === activeIndex
                  ? "w-3 h-3 bg-red-500"
                  : "w-2.5 h-2.5 border border-gray-300 hover:border-red-400"
              }`}
              aria-label={`Ir a la propiedad ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySlider;
