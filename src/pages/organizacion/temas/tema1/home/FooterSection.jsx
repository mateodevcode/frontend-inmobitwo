import { useState } from "react";
import {
  PiHouseFill,
  PiPhoneFill,
  PiEnvelopeSimpleFill,
  PiMapPinFill,
} from "react-icons/pi";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const featuredHouses = [
  "#Villa",
  "#Commercial",
  "#Farm Houses",
  "#Apartments",
  "#Land/Plot",
];
const quickLinks = [
  "Strategy Services",
  "Management",
  "Privacy & Policy",
  "Sitemap",
  "Term & Conditions",
];
const supportLinks = [
  "Help Center",
  "FAQs",
  "Contact Us",
  "Ticket Support",
  "Live Chat",
];
const partnerLogos = [
  "REAL ESTATE",
  "Real Estate",
  "Alpha House",
  "REAL ESTATE",
];

const QR_PATTERN = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
];

const FakeQrCode = () => (
  <div className="grid grid-cols-7 gap-[1px] w-10 h-10 bg-white p-1 rounded-sm shrink-0">
    {QR_PATTERN.flat().map((cell, i) => (
      <div key={i} className={cell ? "bg-black" : "bg-white"} />
    ))}
  </div>
);

const FooterLink = ({ children }) => (
  <li className="flex items-center gap-2">
    <PiHouseFill className="text-red-500 shrink-0" />
    <a
      href="#"
      className="text-gray-300 hover:text-white transition-colors text-sm"
    >
      {children}
    </a>
  </li>
);

const ScallopedTop = () => (
  <svg
    viewBox="0 0 1600 120"
    preserveAspectRatio="none"
    className="block w-full h-[100px] text-gray-950"
  >
    <path
      d="M0,120 L0,50 C 120,120 320,120 420,40 C 500,-20 620,-20 700,30 C 760,65 880,65 940,30 C 1020,-20 1140,-20 1220,40 C 1320,120 1480,120 1600,50 L1600,120 Z"
      fill="currentColor"
    />
  </svg>
);

const RulerLine = () => {
  const tickSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="30">
      <line x1="0" y1="30" x2="0" y2="6" stroke="#4b5563" stroke-width="1.5" />
      <line x1="10" y1="30" x2="10" y2="20" stroke="#4b5563" stroke-width="1" />
      <line x1="20" y1="30" x2="20" y2="20" stroke="#4b5563" stroke-width="1" />
      <line x1="30" y1="30" x2="30" y2="16" stroke="#4b5563" stroke-width="1" />
      <line x1="40" y1="30" x2="40" y2="20" stroke="#4b5563" stroke-width="1" />
      <line x1="50" y1="30" x2="50" y2="20" stroke="#4b5563" stroke-width="1" />
      <line x1="60" y1="30" x2="60" y2="16" stroke="#4b5563" stroke-width="1" />
      <line x1="70" y1="30" x2="70" y2="20" stroke="#4b5563" stroke-width="1" />
    </svg>
  `);

  return (
    <div
      className="w-full h-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,${tickSvg}")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "80px 30px",
      }}
    />
  );
};

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Suscripción:", { email, agreed });
  };

  return (
    <footer className="w-full bg-white">
      {/* Borde superior recortado con los logos de partners */}
      <div className="relative bg-gray-950">
        <ScallopedTop />
        <div className="absolute top-0 left-0 w-full flex items-center justify-center gap-14 pt-6">
          {partnerLogos.map((logo, i) => (
            <span
              key={i}
              className="text-gray-500 text-xs font-semibold tracking-wide uppercase"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-950 pt-4 pb-10">
        <div className="w-10/12 mx-auto">
          {/* Columnas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Marca */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-end gap-0.5 h-7">
                  <span className="w-1.5 h-3 bg-white rounded-sm" />
                  <span className="w-1.5 h-5 bg-red-500 rounded-sm" />
                  <span className="w-1.5 h-7 bg-white rounded-sm" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-lg leading-none">
                    PILLER
                  </p>
                  <p className="text-gray-400 text-[10px] leading-none mt-0.5">
                    Real Estate Solution
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Pillar is a luxury to the resilience, adaptability, Spacious
                modern villa living room with centrally placed swimming pool
                blending indoor–outdoor.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <PiPhoneFill className="text-white text-sm" />
                  </span>
                  <span className="text-gray-300 text-sm">
                    +00 (123) 456 789 012
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <PiEnvelopeSimpleFill className="text-white text-sm" />
                  </span>
                  <span className="text-gray-300 text-sm">
                    infomail123@domain.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <PiMapPinFill className="text-white text-sm" />
                  </span>
                  <span className="text-gray-300 text-sm">
                    West 2nd lane, Inner circular road, New York City
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Houses */}
            <div>
              <h4 className="text-white font-bold mb-4">Featured Houses</h4>
              <ul className="space-y-3">
                {featuredHouses.map((item) => (
                  <FooterLink key={item}>{item}</FooterLink>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <FooterLink key={item}>{item}</FooterLink>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <FooterLink key={item}>{item}</FooterLink>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Sign up to receive the latest articles
              </p>

              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-semibold rounded-lg py-2.5 mb-3"
                >
                  Subscribe Now
                </button>

                <label className="flex items-start gap-2 text-gray-400 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5"
                  />
                  I have read and agree to the terms &amp; conditions
                </label>
              </form>
            </div>
          </div>

          {/* CTAs: comprar/vender + descarga de apps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
              <span className="text-3xl">🏡</span>
              <div className="text-white leading-tight">
                <p className="text-sm">Need to Home</p>
                <p className="font-bold text-lg">buy or sell?</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
              <FaApple className="text-white text-3xl shrink-0" />
              <div className="text-white leading-tight flex-1">
                <p className="text-sm">Download on the</p>
                <p className="font-bold text-lg">App Store</p>
              </div>
              <FakeQrCode />
            </div>

            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
              <FaGooglePlay className="text-red-500 text-3xl shrink-0" />
              <div className="text-white leading-tight flex-1">
                <p className="text-sm">GET IT ON</p>
                <p className="font-bold text-lg">Google Play</p>
              </div>
              <FakeQrCode />
            </div>
          </div>
        </div>

        {/* Línea de regla decorativa */}
        <div className="w-10/12 mx-auto mt-10">
          <RulerLine />
        </div>

        {/* Barra inferior */}
        <div className="w-10/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Copyright © 2025{" "}
            <span className="text-red-500 font-semibold">Piller</span>. All
            Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm mr-1">Social Media:</span>
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
                >
                  <Icon className="text-xs" />
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
