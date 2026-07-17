import { PiHeart, PiMapPinLine } from "react-icons/pi";
import { FaGooglePlay, FaApple, FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

// Pequeño patrón de QR "falso" (solo decorativo, no escaneable) hecho con una grilla fija
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
  <div className="grid grid-cols-7 gap-[1px] w-11 h-11 bg-white p-1 rounded-sm">
    {QR_PATTERN.flat().map((cell, i) => (
      <div key={i} className={cell ? "bg-black" : "bg-white"} />
    ))}
  </div>
);

const RulerStrip = () => {
  // Un tile SVG de ticks (marcas cortas + una larga cada tanto) que se repite horizontalmente.
  // La animación mueve el background-position en bucle infinito, así se ve "corriendo" sin cortes.
  const tickSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40">
      <line x1="0" y1="40" x2="0" y2="14" stroke="black" stroke-width="2" />
      <line x1="12.5" y1="40" x2="12.5" y2="28" stroke="black" stroke-width="1.5" />
      <line x1="25" y1="40" x2="25" y2="28" stroke="black" stroke-width="1.5" />
      <line x1="37.5" y1="40" x2="37.5" y2="22" stroke="black" stroke-width="1.5" />
      <line x1="50" y1="40" x2="50" y2="28" stroke="black" stroke-width="1.5" />
      <line x1="62.5" y1="40" x2="62.5" y2="28" stroke="black" stroke-width="1.5" />
      <line x1="75" y1="40" x2="75" y2="22" stroke="black" stroke-width="1.5" />
      <line x1="87.5" y1="40" x2="87.5" y2="28" stroke="black" stroke-width="1.5" />
    </svg>
  `);

  return (
    <div className="w-full h-10 bg-stone-100 overflow-hidden">
      <style>{`
        @keyframes ruler-scroll {
          from { background-position-x: 0; }
          to { background-position-x: -100px; }
        }
      `}</style>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,${tickSvg}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "100px 40px",
          animation: "ruler-scroll 4s linear infinite",
        }}
      />
    </div>
  );
};

const CurvedArrow = () => (
  <svg
    width="140"
    height="90"
    viewBox="0 0 140 90"
    fill="none"
    className="text-gray-900"
  >
    <path
      d="M120 10C90 10 50 20 25 60"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M25 60L20 42" stroke="currentColor" strokeWidth="2" />
    <path d="M25 60L42 55" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Squiggle = () => (
  <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
    <path
      d="M6 4C6 4 30 8 12 20C-6 32 40 34 22 46C4 58 40 54 40 54"
      stroke="black"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

const Asterisk = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="4" y1="6" x2="20" y2="18" />
      <line x1="20" y1="6" x2="4" y2="18" />
    </g>
  </svg>
);

const MiniPropertyCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-32 shrink-0">
    <div className="relative h-20">
      <img
        src="https://picsum.photos/id/1080/300/200"
        alt="Charming Beach House"
        className="w-full h-full object-cover"
      />
      <span className="absolute top-1.5 left-1.5 bg-gray-900/90 text-white text-[8px] font-medium px-1.5 py-0.5 rounded">
        For Rent
      </span>
      <button className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
        <PiHeart className="text-gray-700 text-[10px]" />
      </button>
    </div>
    <div className="p-2">
      <h4 className="text-[11px] font-bold text-gray-900 truncate">
        Charming Beach House
      </h4>
      <p className="flex items-center gap-0.5 text-[9px] text-gray-500 mt-0.5 truncate">
        <PiMapPinLine className="text-red-500 shrink-0 text-[10px]" />
        39581 Rohan Estates
      </p>
      <div className="flex items-center gap-1.5 text-[8px] text-gray-500 mt-1.5">
        <span className="flex items-center gap-0.5">
          <FaBed /> 4
        </span>
        <span className="flex items-center gap-0.5">
          <FaBath /> 2
        </span>
        <span className="flex items-center gap-0.5">
          <BiArea /> 1500
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] font-bold text-gray-900">$179,800</span>
      </div>
      <button className="mt-1.5 w-full text-[9px] font-medium border border-gray-200 rounded px-2 py-1">
        View More
      </button>
    </div>
  </div>
);

const PhoneMockup = () => (
  <div className="relative mx-auto w-[280px]">
    {/* Anillos decorativos detrás del teléfono */}
    <div className="absolute -inset-16 -z-10 flex items-center justify-center">
      <div className="w-[420px] h-[420px] rounded-full border border-gray-200" />
    </div>
    <div className="absolute -inset-6 -z-10 flex items-center justify-center">
      <div className="w-[340px] h-[340px] rounded-full border border-gray-200" />
    </div>

    <Asterisk className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-10 text-red-500" />

    {/* Marco del teléfono */}
    <div className="rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden">
      <div className="bg-white h-[560px] overflow-hidden relative">
        {/* Header con imagen de fondo */}
        <div className="relative h-40">
          <img
            src="https://picsum.photos/id/1074/500/300"
            alt="App header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
            <span className="font-bold text-sm">PIL</span>
            <span className="text-lg">≡</span>
          </div>

          <div className="absolute bottom-4 left-3 right-3 text-white">
            <p className="font-bold leading-tight">
              Find Your Perfect Home to Life Spend
            </p>
            <button className="mt-2 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
              🔍 Advance Search
            </button>
          </div>
        </div>

        {/* Sección de propiedades destacadas */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 justify-center mb-1">
            <div className="w-4 h-px bg-red-500" />
            <span className="text-red-500 text-[9px] font-semibold uppercase">
              Latest Properties
            </span>
            <div className="w-4 h-px bg-red-500" />
          </div>
          <h3 className="text-center font-bold text-sm mb-3">
            Featured Properties
          </h3>

          <div className="flex gap-2 overflow-hidden">
            <MiniPropertyCard />
            <MiniPropertyCard />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DownloadAppSection = () => (
  <div className="w-full bg-white">
    <RulerStrip />

    <div className="py-16">
      <div className="w-10/12 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* Columna izquierda: collage de fotos */}
        <div className="relative h-[480px] hidden lg:block">
          <Squiggle className="absolute left-0 top-8" />

          <div className="absolute top-8 left-16 w-64 h-64 rounded-full overflow-hidden shadow-lg">
            <img
              src="https://i.pravatar.cc/500?img=68"
              alt="Pareja usando la app"
              className="w-full h-full object-cover"
            />
          </div>

          <Asterisk className="absolute left-56 top-[300px] w-8 h-8 text-red-500 z-10" />

          <div className="absolute left-0 top-[300px] w-44 h-44 rounded-full overflow-hidden shadow-lg">
            <img
              src="https://i.pravatar.cc/500?img=47"
              alt="Persona usando el celular"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute left-40 top-[280px] w-52 h-52 rounded-full overflow-hidden shadow-lg">
            <img
              src="https://i.pravatar.cc/500?img=59"
              alt="Persona usando el celular"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Columna central: texto + botones de descarga */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-px bg-red-500" />
            <h3 className="text-red-500 text-sm font-semibold">Download APP</h3>
            <div className="w-8 h-px bg-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 leading-tight">
            Scan QR for get latest Properties Over the time
          </h2>
          <p className="text-gray-500 mt-4 max-w-sm mx-auto">
            Simply scan the QR code on the right with your phone's camera, then
            click to open the app download page.
          </p>

          <div className="flex items-start justify-center gap-3 mt-8">
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-3">
                <FaGooglePlay className="text-2xl" />
                <span className="text-left text-sm leading-tight">
                  GET IT ON
                  <br />
                  <span className="font-bold text-base">Google Play</span>
                </span>
                <FakeQrCode />
              </button>

              <button className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-3">
                <FaApple className="text-2xl" />
                <span className="text-left text-sm leading-tight">
                  Download on the
                  <br />
                  <span className="font-bold text-base">App Store</span>
                </span>
                <FakeQrCode />
              </button>
            </div>

            <div className="hidden sm:flex flex-col items-center pt-2">
              <CurvedArrow />
              <span className="text-sm font-medium text-gray-900 -mt-2">
                Scan to Download
              </span>
            </div>
          </div>
        </div>

        {/* Columna derecha: mockup del teléfono */}
        <div className="hidden lg:block">
          <PhoneMockup />
        </div>
      </div>
    </div>
  </div>
);

export default DownloadAppSection;
