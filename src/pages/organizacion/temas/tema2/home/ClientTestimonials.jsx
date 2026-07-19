import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star, Building2, Home } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Bauch",
    role: "Property owner",
    rating: "4.9",
    quote:
      "Great experience for a work traveler! Everything from hours is our part the central location to the quiet desk, supportive staff, ok but it and reliable Wi-Fi on was just right for working hours.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=80&w=200&auto=format&fit=crop",
    logo: "realEstate",
  },
  {
    name: "Marshell Jack",
    role: "Property owner",
    rating: "4.7",
    quote:
      "Perfect place for a business trip! The location was convenient, and the Wi-Fi was reliable. I had everything I needed, from a quiet workspace in the room to a great breakfast in the morning.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=80&w=200&auto=format&fit=crop",
    logo: "alphaHouse",
  },
  {
    name: "Walter Deckow",
    role: "Property owner",
    rating: "4.9",
    quote:
      "Ideal business accommodation! I loved the fast Wi-Fi, peaceful room with a desk and other, strong coffee in the on morning, my trip super and the breakfast kept me throughout the trip.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=80&w=200&auto=format&fit=crop",
    logo: "realEstate",
  },
  {
    name: "Angela Reyes",
    role: "Property owner",
    rating: "4.8",
    quote:
      "Experience business trip and enjoyed my stay, helped with my extended stay, and on in the front desk was on top of it, and the breakfast was fresh and delightful.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=80&w=200&auto=format&fit=crop",
    logo: "alphaHouse",
  },
];

// Same subtle hexagon-outline texture used elsewhere in the page.
const HEX_PATTERN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16 Z' fill='none' stroke='%23E4DFD8' stroke-width='1'/%3E%3Cpath d='M28 34 L56 50 L56 84 L28 100 L0 84 L0 50 Z' fill='none' stroke='%23E4DFD8' stroke-width='1'/%3E%3C/svg%3E";

function Logo({ variant }) {
  if (variant === "alphaHouse") {
    return (
      <div className="flex items-center gap-2 text-neutral-400">
        <Home size={20} strokeWidth={1.5} />
        <div className="leading-tight text-left">
          <p className="text-xs font-semibold text-neutral-500">Alpha House</p>
          <p className="text-[10px] text-neutral-400">Company slogan</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-neutral-400">
      <Building2 size={20} strokeWidth={1.5} />
      <div className="leading-tight text-left">
        <p className="text-xs font-semibold text-neutral-500">REAL ESTATE</p>
        <p className="text-[10px] text-neutral-400">Home Solutions</p>
      </div>
    </div>
  );
}

function TestimonialCard({ item, active }) {
  return (
    <div
      className={`relative shrink-0 w-[80%] sm:w-[46%] lg:w-[30%] rounded-2xl bg-white px-8 pt-8 pb-10 snap-start transition-shadow duration-300 ${
        active ? "shadow-xl shadow-black/10" : "shadow-sm shadow-black/5"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`text-6xl leading-none font-serif select-none ${
            active ? "text-[#FF1B1C]" : "text-neutral-200"
          }`}
        >
          &#10077;
        </span>
        <Logo variant={item.logo} />
      </div>

      <p className="text-neutral-700 text-[15px] leading-relaxed mb-10">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="flex items-end justify-between">
        <div>
          <p className="font-bold text-neutral-900">{item.name}</p>
          <p className="text-sm text-neutral-500">{item.role}</p>
        </div>

        <div className="relative shrink-0">
          <img
            src={item.avatar}
            alt={item.name}
            className={`w-14 h-14 rounded-full object-cover ${
              active ? "ring-4 ring-white shadow-lg shadow-black/20" : ""
            }`}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center gap-0.5">
            <Star size={8} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-[9px] font-semibold">
              {item.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientTestimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const goTo = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const gap = 24;
    const amount = card ? card.getBoundingClientRect().width + gap : 380;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });

    setActiveIndex((i) => {
      const next = i + direction;
      if (next < 0) return TESTIMONIALS.length - 1;
      if (next > TESTIMONIALS.length - 1) return 0;
      return next;
    });
  };

  const progress = ((activeIndex + 1) / TESTIMONIALS.length) * 100;

  return (
    <section
      className="relative bg-[#F4F0EB] py-20 overflow-hidden font-sans"
      style={{
        backgroundImage: `url("${HEX_PATTERN_URL}")`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="text-center mb-14 px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-[#FF1B1C]" />
          <span className="text-[#FF1B1C] text-sm font-semibold tracking-wide">
            Testimonials
          </span>
          <span className="w-6 h-px bg-[#FF1B1C]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
          What Our Client Says
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 lg:px-[8%]"
        style={{ scrollbarWidth: "none" }}
      >
        {TESTIMONIALS.map((item, i) => (
          <TestimonialCard
            key={item.name}
            item={item}
            active={i === activeIndex}
          />
        ))}
      </div>

      <div className="flex items-center gap-5 w-11/12 max-w-4xl mx-auto mt-14 px-6 lg:px-0">
        <button
          type="button"
          onClick={() => goTo(-1)}
          aria-label="Previous testimonial"
          className="shrink-0 w-11 h-11 rounded-full border border-[#FF1B1C]/40 flex items-center justify-center text-[#FF1B1C] hover:bg-[#FF1B1C] hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="relative flex-1 h-px bg-neutral-800/70">
          <div
            className="absolute left-0 top-0 h-px bg-[#FF1B1C] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => goTo(1)}
          aria-label="Next testimonial"
          className="shrink-0 w-11 h-11 rounded-full border border-[#FF1B1C]/40 flex items-center justify-center text-[#FF1B1C] hover:bg-[#FF1B1C] hover:text-white transition-colors duration-200"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
