import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiHeart, PiHeartFill, PiMapPinLine } from "react-icons/pi";
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

// Posiciones en % relativo al contenedor del mapa (top/left) para ubicar cada pin
const properties = [
  {
    id: 1,
    top: "44%",
    left: "18%",
    title: "Vinnytsia Estate",
    location: "12034 Rohan Estates, New York",
    price: 210500,
    beds: 3,
    baths: 2,
    sqft: 1350,
    image: "https://picsum.photos/id/1040/500/320",
  },
  {
    id: 2,
    top: "58%",
    left: "47%",
    title: "Contemporary Loft",
    location: "39581 Rohan Estates, New York",
    price: 335800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    image: "https://picsum.photos/id/1074/500/320",
  },
  {
    id: 3,
    top: "76%",
    left: "45%",
    title: "Black Sea Villa",
    location: "8821 Rohan Estates, New York",
    price: 420000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    image: "https://picsum.photos/id/1031/500/320",
  },
  {
    id: 4,
    top: "48%",
    left: "78%",
    title: "Skyline Penthouse",
    location: "5501 Rohan Estates, New York",
    price: 560000,
    beds: 3,
    baths: 3,
    sqft: 2100,
    image: "https://picsum.photos/id/1029/500/320",
  },
];

const formatPrice = (value) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MapPin = ({ isActive }) => (
  <svg
    width="36"
    height="46"
    viewBox="0 0 36 46"
    fill="none"
    className={`transition-transform duration-200 drop-shadow-md ${isActive ? "scale-110" : ""}`}
  >
    <ellipse cx="18" cy="42" rx="9" ry="3" fill="rgba(0,0,0,0.25)" />
    <path
      d="M18 0C8.6 0 1 7.6 1 17c0 11.5 17 27 17 27s17-15.5 17-27C35 7.6 27.4 0 18 0Z"
      fill="#ef4444"
    />
    <circle cx="18" cy="17" r="8" fill="white" />
  </svg>
);

const PropertyPopup = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="w-72 bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Imagen + precio */}
      <div className="relative h-40">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite((prev) => !prev);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Guardar en favoritos"
        >
          {isFavorite ? (
            <PiHeartFill className="text-red-500 text-lg" />
          ) : (
            <PiHeart className="text-gray-700 text-lg" />
          )}
        </button>

        <span className="absolute bottom-3 left-4 text-white text-lg font-bold">
          {formatPrice(property.price)}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{property.title}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <PiMapPinLine className="text-red-500 shrink-0" />
          {property.location}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-100 mt-3 pt-3">
          <span className="flex items-center gap-1.5">
            <FaBed className="text-gray-400" /> Bed {property.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <FaBath className="text-gray-400" /> Bath {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <BiArea className="text-gray-400" /> {property.sqft} sqft
          </span>
        </div>
      </div>
    </div>
  );
};

const PropertyMap = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="w-full h-full">
      <div className="relative" style={{ height: "70vh", minHeight: 500 }}>
        <img
          src="/tema/tema1/mapa.png"
          alt="Mapa de propiedades"
          className="w-full h-full object-cover rounded-3xl"
        />

        {/* Pines */}
        {properties.map((property) => {
          const isActive = hoveredId === property.id;

          return (
            <div
              key={property.id}
              className="absolute z-10"
              style={{
                top: property.top,
                left: property.left,
                transform: "translate(-50%, -100%)",
              }}
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Popup al hacer hover */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20"
                  >
                    <PropertyPopup property={property} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="cursor-pointer">
                <MapPin isActive={isActive} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyMap;
