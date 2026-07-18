import { Search } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const AGENTS = [
  {
    name: "Bernice Roberts",
    role: "Real Estate Manager",
    image:
      "https://images.unsplash.com/photo-1618077360395-f3068be8e001?fm=jpg&q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Mr. Raul Hirthe",
    role: "Listing Coordinator",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fm=jpg&q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Michel John",
    role: "Property Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "William Bins",
    role: "Leasing Consultant",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fm=jpg&q=80&w=600&auto=format&fit=crop",
  },
];

const SOCIALS = [FaFacebook, FaInstagram, FaLinkedin];

// Same subtle hexagon-outline texture used behind the agent portraits.
const HEX_PATTERN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16 Z' fill='none' stroke='%23E4E4E4' stroke-width='1'/%3E%3Cpath d='M28 34 L56 50 L56 84 L28 100 L0 84 L0 50 Z' fill='none' stroke='%23E4E4E4' stroke-width='1'/%3E%3C/svg%3E";

function AgentCard({ name, role, image }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6 flex flex-col items-center hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300">
      <div
        className="relative w-full h-64 mb-6 flex items-end justify-center overflow-hidden bg-neutral-50"
        style={{
          borderRadius: "9999px 9999px 24px 24px",
          backgroundImage: `url("${HEX_PATTERN_URL}")`,
        }}
      >
        <img
          src={image}
          alt={name}
          className="h-full w-auto object-cover object-top"
        />
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-1">{name}</h3>
      <p className="text-sm text-neutral-500 mb-5">{role}</p>

      <div className="flex items-center gap-2.5">
        {SOCIALS.map((Icon, i) => (
          <a
            key={i}
            href="/"
            aria-label={Icon.displayName || "social link"}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-[#FF1B1C] hover:border-[#FF1B1C] hover:text-white transition-colors duration-200"
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MeetOurAgents() {
  return (
    <section className="bg-white py-20 font-sans">
      <div className="text-center mb-14 px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-[#FF1B1C]" />
          <span className="text-[#FF1B1C] text-sm font-semibold tracking-wide">
            Team Members
          </span>
          <span className="w-6 h-px bg-[#FF1B1C]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
          Meet Our Pillar Agents
        </h2>
      </div>

      <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>

      <div className="text-center px-6">
        <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Explore Property agents are here to help with all your buying, renting
          and selling goals. Find the home of your dreams with an expert you can
          trust.{" "}
          <a href="/" className="text-[#FF1B1C] font-medium hover:underline">
            Let&rsquo;s chat
          </a>
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-7 py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200"
        >
          Find Your Location Agent
          <Search size={15} />
        </button>
      </div>
    </section>
  );
}
