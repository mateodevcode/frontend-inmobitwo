import { useState } from "react";
import { ChevronDown, Home, Search, Menu, X } from "lucide-react";

const links = [
  { label: "Home", dropdown: true },
  { label: "About Us", dropdown: false },
  { label: "Property", dropdown: true },
  { label: "Agencies", dropdown: true },
  { label: "Pages", dropdown: true },
  { label: "Blog", dropdown: true },
  { label: "Contact Us", dropdown: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-center border-t border-white/20 border-b">
      <div className="relative z-30 w-11/12">
        <div className="max-w-container mx-auto px-8 flex items-center justify-between h-24">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <path d="M4 30V14l7-4v20H4Z" fill="#fff" />
              <path d="M15 30V8l7-4v26h-7Z" fill="#FF4A3D" />
              <path d="M26 30V16l7-4v18h-7Z" fill="#fff" fillOpacity="0.55" />
            </svg>
            <div className="leading-tight">
              <p className="text-white text-2xl font-extrabold tracking-wide">
                PILLER
              </p>
              <p className="text-white/60 text-[11px] tracking-[0.2em] -mt-0.5">
                REAL ESTATE SOLUTION
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-9">
            {links.map((link) => (
              <a
                key={link.label}
                href="#"
                className="flex items-center gap-1 text-[15px] font-medium text-white/90 hover:text-brand-orange transition-colors"
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDown size={15} className="opacity-70" />
                )}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button className="flex items-center gap-2 border border-white/30 hover:border-white text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors">
              <Home size={16} />
              Add Listing
            </button>
            <button
              aria-label="Search"
              className="w-11 h-11 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition-colors"
            >
              <Search size={17} />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-[#0c1220]/95 backdrop-blur border-t border-white/10 px-8 py-6 space-y-4">
            {links.map((link) => (
              <a
                key={link.label}
                href="#"
                className="flex items-center justify-between text-white/90 text-base font-medium py-1"
              >
                {link.label}
                {link.dropdown && <ChevronDown size={16} />}
              </a>
            ))}
            <button className="w-full flex items-center justify-center gap-2 border border-white/30 text-white text-sm font-semibold rounded-full px-5 py-3 mt-2">
              <Home size={16} />
              Add Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
