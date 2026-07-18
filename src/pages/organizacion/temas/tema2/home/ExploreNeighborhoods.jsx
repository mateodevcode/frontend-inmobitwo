import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CITIES = [
  {
    city: "Jersey City, New York",
    properties: 187,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
  {
    city: "Cape Town, South Africa",
    properties: 225,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
  {
    city: "Los Angeles, New York",
    properties: 143,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
  {
    city: "Seoul, South Korea",
    properties: 321,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
  {
    city: "Seoul, South Korea",
    properties: 212,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
  {
    city: "Miami, Florida",
    properties: 198,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?fm=jpg&q=80&w=900&auto=format&fit=crop",
  },
];

const TOTAL_PAGES = 12;

function CityCard({ city, properties, image }) {
  return (
    <div className="relative shrink-0 w-[78%] sm:w-[46%] lg:w-[23%] h-[420px] rounded-2xl overflow-hidden snap-start">
      <img
        src={image}
        alt={city}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/90 text-sm mb-1">{properties} Properties</p>
        <p className="text-white text-xl font-bold">{city}</p>
      </div>
    </div>
  );
}

export default function ExploreNeighborhoods() {
  const trackRef = useRef(null);
  const [page, setPage] = useState(4);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const gap = 24;
    const amount = card ? card.getBoundingClientRect().width + gap : 320;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });

    setPage((p) => {
      const next = p + direction;
      if (next < 1) return TOTAL_PAGES;
      if (next > TOTAL_PAGES) return 1;
      return next;
    });
  };

  return (
    <section className="bg-white py-20 font-sans">
      <div className="text-center mb-12 px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-[#FF1B1C]" />
          <span className="text-[#FF1B1C] text-sm font-semibold tracking-wide">
            Explore Cities
          </span>
          <span className="w-6 h-px bg-[#FF1B1C]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
          Explore The Neighborhoods
        </h2>
        <p className="text-neutral-500 text-sm">
          Find your dream apartment with our listing
        </p>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 lg:px-[8%] scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {CITIES.map((c, i) => (
            <CityCard key={`${c.city}-${i}`} {...c} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous city"
          className="hidden sm:flex absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg shadow-black/15 items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next city"
          className="hidden sm:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg shadow-black/15 items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
        >
          <ArrowRight size={18} className="text-neutral-800" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-10">
        <span className="text-neutral-900 font-semibold text-sm">
          {String(page).padStart(2, "0")}
        </span>
        <span className="w-16 h-px bg-[#FF1B1C]" />
        <span className="text-[#FF1B1C] font-semibold text-sm">
          {String(TOTAL_PAGES).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
