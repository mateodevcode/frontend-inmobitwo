import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { PiLinkedinLogoFill, PiEnvelopeSimpleFill } from "react-icons/pi";

const agents = [
  {
    id: 1,
    name: "Bernice Roberts",
    role: "Leasing Consultant",
    image: "https://i.pravatar.cc/500?img=13",
  },
  {
    id: 2,
    name: "Martha Leffler",
    role: "Real Estate Manager",
    image: "https://i.pravatar.cc/500?img=14",
  },
  {
    id: 3,
    name: "Thomas Kirlin",
    role: "Listing Coordinator",
    image: "https://i.pravatar.cc/500?img=15",
  },
  {
    id: 4,
    name: "Vickie Wisozk",
    role: "Real Estate Manager",
    image: "https://i.pravatar.cc/500?img=33",
  },
  {
    id: 5,
    name: "Alaina Hudson",
    role: "Property Advisor",
    image: "https://i.pravatar.cc/500?img=47",
  },
  {
    id: 6,
    name: "Corey Stanton",
    role: "Leasing Consultant",
    image: "https://i.pravatar.cc/500?img=53",
  },
];

// Forma de "casa": pico arriba, lados rectos, base plana
const HOUSE_CLIP_PATH = "polygon(50% 0%, 100% 32%, 100% 100%, 0% 100%, 0% 32%)";

const getItemsPerView = (width) => {
  if (width < 640) return 1;
  if (width < 900) return 2;
  if (width < 1280) return 3;
  return 4;
};

const AgentCard = ({ agent }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Marco en forma de casa */}
      <div
        className={`relative h-[380px] overflow-hidden transition-colors duration-300 ${
          isHovered ? "bg-red-100" : "bg-stone-100"
        }`}
        style={{ clipPath: HOUSE_CLIP_PATH }}
      >
        <img
          src={agent.image}
          alt={agent.name}
          className="absolute bottom-0 left-1/2 w-[78%] h-[88%] object-cover object-top rounded-t-full transition-transform duration-300"
          style={{
            transform: `translateX(-50%) scale(${isHovered ? 1.06 : 1})`,
          }}
        />
      </div>

      {/* Card de nombre / rol */}
      <div className="absolute left-4 right-4 -bottom-8 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {agent.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{agent.role}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label={`LinkedIn de ${agent.name}`}
          >
            <PiLinkedinLogoFill className="text-base" />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label={`Email de ${agent.name}`}
          >
            <PiEnvelopeSimpleFill className="text-base" />
          </a>
        </div>
      </div>
    </div>
  );
};

const AgentsSlider = () => {
  const [itemsPerView, setItemsPerView] = useState(() =>
    typeof window !== "undefined" ? getItemsPerView(window.innerWidth) : 4,
  );
  const [scrollIndex, setScrollIndex] = useState(0);

  const maxIndex = useMemo(
    () => Math.max(0, agents.length - itemsPerView),
    [itemsPerView],
  );

  useEffect(() => {
    const handleResize = () =>
      setItemsPerView(getItemsPerView(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setScrollIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(
    () => setScrollIndex((prev) => (prev <= 0 ? maxIndex : prev - 1)),
    [maxIndex],
  );
  const goNext = useCallback(
    () => setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1)),
    [maxIndex],
  );

  return (
    <div className="w-full bg-white py-16">
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-px bg-red-500" />
            <h3 className="text-red-500 text-sm font-semibold">Team Members</h3>
            <div className="w-8 h-px bg-red-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Meet Our Pillar Agents
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Flechas */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Agente anterior"
          >
            ←
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Siguiente agente"
          >
            →
          </button>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8 pb-8"
              animate={{ x: `-${scrollIndex * (100 / itemsPerView)}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${(32 * (itemsPerView - 1)) / itemsPerView}px)`,
                  }}
                >
                  <AgentCard agent={agent} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Texto inferior */}
        <p className="text-center text-gray-500 mt-10 max-w-2xl mx-auto">
          Explore Property agents are here to help with all your buying, renting
          and selling goals. Find the home of your dreams with an expert you can
          trust.{" "}
          <a href="#" className="text-red-500 font-medium hover:underline">
            Let's chat
          </a>
        </p>
      </div>
    </div>
  );
};

export default AgentsSlider;
