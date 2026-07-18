import { House, Handshake, KeyRound, Star } from "lucide-react";

const SECTION_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?fm=jpg&q=80&w=2400&auto=format&fit=crop";

const AVATARS = [
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=33",
  "https://i.pravatar.cc/64?img=52",
];

const SERVICES = [
  {
    icon: House,
    title: "Find your home",
    description:
      "Altus cedo tantillus video patrocinor valeo carus subseco vestrum credo virtus.",
    cta: "Find A Home",
  },
  {
    icon: Handshake,
    title: "Sell a Property",
    description:
      "Tantillus certe patrocinor video adipisci valeo carus. Subseco vestrum taedium.",
    cta: "Sell A Home",
  },
  {
    icon: KeyRound,
    title: "Rent a Home",
    description:
      "Velox surgo clarus tantillus confido carus video lumen cedo virtus spes decerno.",
    cta: "Rent A Home",
  },
];

function ServiceCard({ icon: Icon, title, description, cta }) {
  return (
    <div className="flex-1 rounded-2xl bg-white px-8 py-10 flex flex-col items-center text-center shadow-xl shadow-black/20">
      <div className="w-16 h-16 rounded-xl bg-[#FFEDEB] flex items-center justify-center mb-6">
        <Icon size={28} strokeWidth={1.75} className="text-[#FF1B1C]" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px] mb-8">
        {description}
      </p>
      <button
        type="button"
        className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors duration-200"
      >
        {cta}
      </button>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="relative bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${SECTION_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/70" />

      <div className="relative w-11/12 max-w-6xl mx-auto py-20 md:py-24">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-[#FF1B1C]" />
              <span className="text-[#FF1B1C] text-sm font-semibold tracking-wide">
                Why Choose Us
              </span>
              <span className="w-6 h-px bg-[#FF1B1C]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-md">
              Trusted by 100+ Million Buyers
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-emerald-500 fill-emerald-500" />
              <span className="text-white font-semibold text-sm">
                Trustipilot
              </span>
            </div>

            <div className="flex items-center -space-x-3">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-[#FF1B1C] flex items-center justify-center text-white text-[11px] font-bold">
                +59K
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-white text-xs font-medium">
                19k+ clients
              </span>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="flex flex-col md:flex-row gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
