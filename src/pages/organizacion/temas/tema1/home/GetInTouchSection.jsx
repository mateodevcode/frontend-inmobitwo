import { useState } from "react";

const marqueeItems = [
  "Deluxe Cottage – Explore Now!",
  "Luxury Home Available",
  "New Listings Weekly",
  "Book A Private Tour",
];

// Repetimos el set de items varias veces ANTES de duplicarlo para la animación,
// así cada "mitad" es lo bastante ancha para cubrir pantallas anchas sin dejar
// hueco visible al reiniciar el loop (esa era la causa del salto).
const REPEATS_PER_HALF = 3;
const repeatedItems = Array.from({ length: REPEATS_PER_HALF }).flatMap(
  () => marqueeItems,
);

const HouseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M2 10L11 2L20 10"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="4" y="10" width="14" height="10" fill="#ef4444" />
    <rect x="8" y="13" width="2.5" height="2.5" fill="white" />
    <rect x="11.5" y="13" width="2.5" height="2.5" fill="white" />
    <rect x="8" y="16" width="2.5" height="2.5" fill="white" />
    <rect x="11.5" y="16" width="2.5" height="2.5" fill="white" />
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

const CurvedArrow = () => (
  <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
    <path
      d="M85 5C60 5 35 15 20 55"
      stroke="white"
      strokeWidth="2"
      fill="none"
    />
    <path d="M20 55L15 38" stroke="white" strokeWidth="2" />
    <path d="M20 55L36 50" stroke="white" strokeWidth="2" />
  </svg>
);

const Marquee = () => (
  <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-white py-6">
    <style>{`
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
    <div
      className="flex w-max"
      style={{ animation: "marquee-scroll 60s linear infinite" }}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex items-center gap-4 pr-4">
          {repeatedItems.map((text, i) => (
            <span key={`${half}-${i}`} className="flex items-center gap-4">
              <HouseIcon />
              <span className="text-2xl text-gray-800 whitespace-nowrap">
                {text}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí conectarías con tu backend / servicio de formularios
    console.log("Formulario enviado:", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-px bg-red-500" />
        <h3 className="text-red-500 text-sm font-semibold">Get In Touch</h3>
        <div className="w-6 h-px bg-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-6">
        Let's Talk Your Property Goal
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Name*
          </label>
          <input
            type="text"
            required
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange("name")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Email*
          </label>
          <input
            type="email"
            required
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange("email")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Desired Date*
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={handleChange("date")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Desired Date*
          </label>
          <input
            type="time"
            required
            placeholder="Desired Time"
            value={form.time}
            onChange={handleChange("time")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-900 mb-1.5">
          Additional Message
        </label>
        <textarea
          rows={4}
          placeholder="Please write any note here..."
          value={form.message}
          onChange={handleChange("message")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
        />
      </div>

      <button
        type="submit"
        className="mt-6 float-right px-6 py-3 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
      >
        Submit Now
      </button>
    </form>
  );
};

const GetInTouchSection = () => (
  <div className="w-full bg-white pt-8">
    <div className="w-10/12 mx-auto">
      {/* Ya NO tiene overflow-hidden: solo posiciona. El recorte/redondeado
          vive únicamente en la imagen, así el form puede sobresalir libre. */}
      <div className="relative h-135">
        <img
          src="https://picsum.photos/id/1076/1600/1000"
          alt="Propiedad destacada"
          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/10 rounded-3xl pointer-events-none" />

        {/* Mini mapa con flecha */}
        <div className="absolute left-[18%] top-[45%] flex flex-col items-center">
          <span className="text-white font-semibold mb-1">
            Find Fast Our Latest Properties
          </span>
          <CurvedArrow />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/70 shadow-xl -mt-2">
            <img
              src="https://staticmap.openstreetmap.de/staticmap.php?center=40.73,-73.99&zoom=13&size=300x300&maptype=mapnik"
              alt="Mapa"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
            </span>
          </div>
        </div>

        {/* Formulario de contacto: sobresale por debajo del cuadro y queda
            por encima de todo (z-30), incluido el carrusel de abajo */}
        <div className="absolute right-0 bottom-3 lg:right-10 lg:-bottom-20 z-30">
          <ContactForm />
        </div>
      </div>

      {/* Texto que se desplaza infinitamente, justo debajo de la imagen */}
      <Marquee />

      <div className="pb-10">
        <Squiggle />
      </div>
    </div>
  </div>
);

export default GetInTouchSection;
