import {
  Briefcase,
  House,
  MessageSquareText,
  Smile,
  Play,
  Tag,
} from "lucide-react";

const HOUSE_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?fm=jpg&q=80&w=1600&auto=format&fit=crop";

const AGENT_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?fm=jpg&q=80&w=1200&auto=format&fit=crop";

const STATS = [
  { icon: Briefcase, value: "28+", label: "Years of Business" },
  { icon: House, value: "58+", label: "Propertise Sold" },
  { icon: MessageSquareText, value: "25k", label: "5 Stars Reviews" },
  { icon: Smile, value: "98%", label: "Happy Customers" },
];

// Subtle repeating hexagon-outline pattern used as the section's background texture.
const HEX_PATTERN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16 Z' fill='none' stroke='%23E4DFD8' stroke-width='1'/%3E%3Cpath d='M28 34 L56 50 L56 84 L28 100 L0 84 L0 50 Z' fill='none' stroke='%23E4DFD8' stroke-width='1'/%3E%3C/svg%3E";

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl bg-white px-6 py-7 flex flex-col items-center text-center shadow-sm shadow-black/5">
      <div className="w-11 h-11 rounded-full bg-[#FCE7E4] flex items-center justify-center mb-4">
        <Icon size={20} strokeWidth={2} className="text-[#FF1B1C]" />
      </div>
      <p className="text-3xl font-bold text-neutral-900 mb-1">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}

export default function MarketProperty() {
  return (
    <section
      className="relative bg-[#F4F0EB] overflow-hidden font-sans"
      style={{
        backgroundImage: `url("${HEX_PATTERN_URL}")`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-[0.9fr_1fr_0.55fr] items-center gap-10 py-14 px-0">
        {/* Left: blob-shaped video image */}
        <div
          className="relative h-[420px] md:h-[560px] overflow-hidden"
          style={{ borderRadius: "0 260px 260px 0" }}
        >
          <img
            src={HOUSE_IMAGE}
            alt="Featured property"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <button
            type="button"
            aria-label="Play property video"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center hover:bg-white/35 transition-colors duration-200"
          >
            <Play size={22} className="text-white fill-white ml-1" />
          </button>
        </div>

        {/* Middle: copy + stats */}
        <div className="px-6 lg:px-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[#FF1B1C]" />
            <span className="text-[#FF1B1C] text-sm font-semibold tracking-wide">
              Property Values
            </span>
            <span className="w-6 h-px bg-[#FF1B1C]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-8 max-w-sm">
            Market Your Property with Pillar
          </h2>

          <div className="grid grid-cols-2 gap-5 max-w-md">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Right: agent portrait */}
        <div className="relative hidden lg:flex justify-center items-end h-[560px] pr-6">
          <img
            src={AGENT_IMAGE}
            alt="Real estate agent"
            className="h-full w-auto object-cover object-top"
          />
          <div className="absolute top-6 right-2 w-9 h-9 rounded-full bg-[#FF1B1C] flex items-center justify-center shadow-lg shadow-black/20">
            <Tag size={16} className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
