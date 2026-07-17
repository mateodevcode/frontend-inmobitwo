import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PiBuildingOfficeThin,
  PiHouseLineThin,
  PiHandshakeThin,
  PiHouseThin,
  PiKeyThin,
  PiChartLineUpThin,
  PiUsersThreeThin,
  PiShieldCheckThin,
  PiWalletThin,
  PiMapPinAreaThin,
} from "react-icons/pi";

const AUTOPLAY_MS = 5000;

const items = [
  {
    icon: PiHouseThin,
    title: "Buy your first home",
    description:
      "Confido carus video lumen Velox surgo clarus tantillus spes decerno.",
    button: "Find A Home",
  },
  {
    icon: PiKeyThin,
    title: "Move in with ease",
    description:
      "Velox surgo clarus tantillus confido video lumen cedo spes decerno.",
    button: "Rent A Home",
  },
  {
    icon: PiChartLineUpThin,
    title: "Grow your portfolio",
    description:
      "Altus cedo tantillus video patrocinor valeo subseco vestrum credo virtus.",
    button: "Invest Now",
  },
  {
    icon: PiBuildingOfficeThin,
    title: "Commercial Spaces",
    description:
      "Confido carus video lumen Velox surgo clarus tantillus spes decerno.",
    button: "Find A Home",
  },
  {
    icon: PiHouseLineThin,
    title: "Find your perfect home",
    description:
      "Velox surgo clarus tantillus confido video lumen cedo spes decerno..",
    button: "Sell A Home",
  },
  {
    icon: PiHandshakeThin,
    title: "Rent love it like you",
    description:
      "Altus cedo tantillus video patrocinor valeo subseco vestrum credo virtus.",
    button: "Rent A Home",
  },
  {
    icon: PiWalletThin,
    title: "Build wealth effortlessly",
    description:
      "Technology is revolutionizing the legal sector.Technology legal sector.",
    button: "Find A Home",
  },
  {
    icon: PiUsersThreeThin,
    title: "Work with local experts",
    description:
      "Confido carus video lumen Velox surgo clarus tantillus spes decerno.",
    button: "Meet Agents",
  },
  {
    icon: PiShieldCheckThin,
    title: "Buy with confidence",
    description:
      "Velox surgo clarus tantillus confido video lumen cedo spes decerno.",
    button: "Learn More",
  },
  {
    icon: PiMapPinAreaThin,
    title: "Explore new listings",
    description:
      "Altus cedo tantillus video patrocinor valeo subseco vestrum credo virtus.",
    button: "View Listings",
  },
];

const getItemsPerView = (width) => {
  if (width < 640) return 1;
  if (width < 900) return 2;
  if (width < 1280) return 3;
  return 4;
};

const HelpCard = ({ item, index }) => {
  const Icon = item.icon;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="relative bg-white h-full flex flex-col p-8 pt-9"
      style={{
        clipPath: "polygon(0 0, 82% 0, 100% 18%, 100% 100%, 0 100%)",
        boxShadow: "0 20px 40px -20px rgba(0,0,0,0.12)",
      }}
    >
      <span className="absolute top-4 right-6 text-5xl font-extrabold text-gray-200 select-none">
        {number}
      </span>

      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <Icon className="text-3xl text-red-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        {item.description}
      </p>

      <button className="mt-auto self-start text-sm font-semibold px-6 py-3 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
        {item.button}
      </button>
    </div>
  );
};

const PillarHelpSection = () => {
  const [itemsPerView, setItemsPerView] = useState(() =>
    typeof window !== "undefined" ? getItemsPerView(window.innerWidth) : 4,
  );
  const [scrollIndex, setScrollIndex] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const maxIndex = useMemo(
    () => Math.max(0, items.length - itemsPerView),
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

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [maxIndex, isPaused]);

  const goToSlide = useCallback(
    (index) => setScrollIndex(Math.min(index, maxIndex)),
    [maxIndex],
  );

  return (
    <div
      className="w-full py-20"
      style={{
        backgroundColor: "#f7f2ef",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 10px)",
      }}
    >
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-red-500" />
              <h3 className="text-red-500 text-sm font-semibold">What We Do</h3>
              <div className="w-8 h-px bg-red-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              See how Pillar can Help
            </h2>
          </div>

          <button className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-300 text-gray-900 hover:border-gray-900 transition-colors whitespace-nowrap">
            View All Amenities
          </button>
        </div>

        {/* Carrusel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-8"
            animate={{ x: `-${scrollIndex * (100 / itemsPerView)}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${(32 * (itemsPerView - 1)) / itemsPerView}px)`,
                }}
              >
                <HelpCard item={item} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-14">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 rounded-full ${
                index === scrollIndex
                  ? "w-3 h-3 bg-red-500"
                  : "w-2.5 h-2.5 bg-white border border-gray-300 hover:border-red-400"
              }`}
              aria-label={`Ir a la posición ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PillarHelpSection;
