import { useState, useCallback } from "react";
import { PiPlayFill, PiXBold, PiMapPinLine } from "react-icons/pi";
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

const slides = [
  {
    id: 1,
    title: "Charming Beach House",
    location: "39581 Rohan Estates, New York",
    price: 335800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    agent: {
      name: "Walter Deckow",
      role: "Sale Agent",
      avatar: "https://i.pravatar.cc/100?img=13",
    },
    image: "https://picsum.photos/id/1080/1600/1000",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "Contemporary Loft",
    location: "12034 Rohan Estates, New York",
    price: 250800,
    beds: 3,
    baths: 2,
    sqft: 1350,
    agent: {
      name: "Martha Leffler",
      role: "Sale Agent",
      avatar: "https://i.pravatar.cc/100?img=14",
    },
    image: "https://picsum.photos/id/1074/1600/1000",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    title: "Skyline Penthouse",
    location: "5501 Rohan Estates, New York",
    price: 560000,
    beds: 3,
    baths: 3,
    sqft: 2100,
    agent: {
      name: "Thomas Kirlin",
      role: "Sale Agent",
      avatar: "https://i.pravatar.cc/100?img=15",
    },
    image: "https://picsum.photos/id/1029/1600/1000",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const formatPrice = (value) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PulsingPlayButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative w-20 h-20 flex items-center justify-center group"
    aria-label="Reproducir video"
  >
    <style>{`
      @keyframes sonar-ripple {
        0% { transform: scale(0.6); opacity: 0.6; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    `}</style>

    {/* Anillos expansivos, como ondas de sonar saliendo del centro */}
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="absolute inset-0 rounded-full border-2 border-white"
        style={{
          animation: "sonar-ripple 3s ease-out infinite",
          animationDelay: `${i * 1}s`,
        }}
      />
    ))}

    {/* Botón central */}
    <span className="relative z-10 w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/70 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
      <PiPlayFill className="text-white text-2xl ml-1" />
    </span>
  </button>
);

const VideoModal = ({ videoUrl, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Cerrar video"
      >
        <PiXBold className="text-gray-900" />
      </button>

      <video src={videoUrl} controls autoPlay className="w-full h-full" />
    </div>
  </div>
);

const FeaturedPropertyHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const slide = slides[activeIndex];

  const goPrev = useCallback(
    () => setActiveIndex((prev) => (prev <= 0 ? slides.length - 1 : prev - 1)),
    [],
  );
  const goNext = useCallback(
    () => setActiveIndex((prev) => (prev >= slides.length - 1 ? 0 : prev + 1)),
    [],
  );

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Botón de play con ondas expansivas */}
      <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-40">
        <PulsingPlayButton onClick={() => setIsVideoOpen(true)} />
      </div>

      {/* Panel de información */}
      <div className="absolute top-[8%] left-0 lg:left-[6%] w-full max-w-md bg-stone-50 shadow-xl p-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-red-500" />
          <h3 className="text-red-500 text-sm font-semibold">
            Popular Properties
          </h3>
          <div className="w-8 h-px bg-red-500" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-8">
          Featured Properties
        </h2>

        <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <PiMapPinLine className="text-red-500 shrink-0" />
          {slide.location}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 mt-5 pt-4">
          <span className="flex items-center gap-1.5">
            <FaBed className="text-gray-400" /> Bed {slide.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <FaBath className="text-gray-400" /> Bath {slide.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <BiArea className="text-gray-400" /> {slide.sqft} sqft
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 mt-4 pt-5">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(slide.price)}
          </span>
          <button className="text-sm font-semibold px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            View More
          </button>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <img
            src={slide.agent.avatar}
            alt={slide.agent.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {slide.agent.name}
            </p>
            <p className="text-gray-500 text-sm">{slide.agent.role}</p>
          </div>
        </div>
      </div>

      {/* Navegación prev / next */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 text-white">
        <button
          onClick={goPrev}
          className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          prev
        </button>
        <span className="text-sm font-bold">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <div className="w-10 h-px bg-red-400" />
        <button
          onClick={goNext}
          className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          Next
        </button>
      </div>

      {isVideoOpen && (
        <VideoModal
          videoUrl={slide.video}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </div>
  );
};

export default FeaturedPropertyHero;
