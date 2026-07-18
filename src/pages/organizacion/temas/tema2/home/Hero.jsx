import { Play, Star, ArrowRight } from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&q=60",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=60",
  "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=100&h=100&fit=crop&q=60",
];

export default function Hero() {
  return (
    <div className="w-full mx-auto flex items-center justify-center">
      <section
        className="relative min-h-190 bg-cover bg-center flex flex-col w-11/12"
        // style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="relative z-20 flex-1 flex flex-col">
          {/* Content */}
          <div className="max-w-container mx-auto px-8 w-full flex-1 flex items-center">
            <div className="max-w-4xl py-16">
              <h1 className="text-white font-semibold leading-[1.05] text-[42px] sm:text-5xl lg:text-7xl font-poppins">
                Find Your Perfect Place
                <br />
                to <span className="text-rose-600">Call Home</span>
              </h1>

              <button className="mt-9 inline-flex items-center gap-2 bg-rose-600 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-full pl-7 pr-6 py-3 transition-colors group">
                Explore Property
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
              </button>

              {/* Trustpilot / social proof */}
              <div className="mt-12 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-white font-semibold text-lg">
                  <Star size={20} className="fill-[#00b67a] text-[#00b67a]" />
                  Trustipilot
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-3">
                    {avatars.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Cliente satisfecho"
                        className="w-12 h-12 rounded-full border-2 border-white/80 object-cover"
                      />
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-brand-orange text-black text-[12px] font-bold flex items-center justify-center bg-amber-50">
                      +59K
                    </div>
                  </div>

                  <div>
                    <div className="flex text-[#ffb700]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className="fill-[#ffb700]" />
                      ))}
                    </div>
                    <p className="text-white/80 text-xs mt-0.5">19k+ clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Play button + rotating badge */}
          <div className="hidden md:flex absolute right-[18%] top-1/2 -translate-y-1/2 items-center justify-center">
            <div className="relative w-37.5 h-37.5">
              <svg
                viewBox="0 0 150 150"
                className="w-full h-full animate-[spin_18s_linear_infinite]"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 75,75 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                    fill="none"
                  />
                </defs>
                <text
                  fill="white"
                  fontSize="12.5"
                  letterSpacing="3"
                  fontWeight="600"
                >
                  <textPath href="#circlePath" startOffset="0%">
                    REAL ESTATE • HOME • REAL ESTATE • HOME •
                  </textPath>
                </text>
              </svg>
              <button
                aria-label="Play video"
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-lg shadow-black/30"
              >
                <Play size={18} className="fill-white ml-0.5" />
              </button>
            </div>
          </div>

          {/* Slider dots (right side) */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`rounded-full transition-all ${
                  i === 1
                    ? "w-3 h-3 bg-rose-600"
                    : "w-3 h-3 border border-white"
                }`}
              />
            ))}
          </div>

          {/* Bottom prev/next controls */}
          <div className=" absolute bottom-20 z-20 max-w-container mx-auto px-8 w-full flex items-center justify-end gap-6 text-white text-sm font-medium">
            <button className="uppercase tracking-wide text-white/70 hover:text-white transition-colors">
              prev
            </button>
            <span className="text-white/70">02</span>
            <span className="w-16 h-px bg-white/40" />
            <button className="uppercase tracking-wide text-brand-orange hover:text-orange-400 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
