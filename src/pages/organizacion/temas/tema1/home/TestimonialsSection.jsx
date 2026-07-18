import { useState, useCallback } from "react";
import { PiStarFill, PiArrowLeft, PiArrowRight } from "react-icons/pi";

const testimonials = [
  {
    id: 1,
    quotes: [
      "Adinventitias sequi cerno cedo vapulus adhaero decretum suppono iure voluptate. Trans triumphus toties sed cogito carbo valetudo aequus ciminatio conventus. Voluptates decimus vorago suadeo. Culpo carmen adnuo. Verecundia capio denego. Tracto caterva cavus denique culpa vigor tergum possimus.",
      "Aer arceo umerus asperiores templum desidero caritas. Velum adipisci verumtamen comparo ascisco ceno vitiosus aeneus tenetur bibo.",
    ],
    author: "Georgia Schaden",
    role: "Property owner",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 2,
    quotes: [
      "Solus tenuis cresco tredecim tantillus. Adficio adnuo comburo vulticulus arceo aequitas amiculum coniecto. Terra vespillo sursum cui thymum ante.",
      "Absum arto commemoro curriculum cubicularis. Coadunatio caterva synagoga careo audeo cornu sto vespillo torqueo.",
    ],
    author: "Marcus Feil",
    role: "First-time buyer",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 3,
    quotes: [
      "Ustilo aegre suasoria adamo cursim theatrum decet clam adaugeo delego. Turba ratione asper commodi utrimque conservo tibi.",
      "Umerus doloremque avaritia summopere adfectus vinum cognomen accedo termes.",
    ],
    author: "Priya Anand",
    role: "Real estate investor",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
];

const TrustScorePanel = () => (
  <div className="bg-stone-100 rounded-2xl p-8 w-full max-w-sm">
    <div className="flex items-start gap-1">
      <span className="text-6xl font-extrabold text-gray-900">4.9</span>
      <span className="text-red-500 text-3xl leading-none">*</span>
    </div>

    <div className="flex gap-1 mt-4 text-amber-400 text-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <PiStarFill key={i} />
      ))}
    </div>
    <p className="text-gray-900 font-semibold mt-2">
      Trust-score on 189+ reviews
    </p>

    <button className="mt-6 w-full border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-900 hover:border-gray-900 transition-colors">
      View All Reviews
    </button>

    <div className="flex items-center gap-2 mt-8">
      <PiStarFill className="text-emerald-600 text-xl" />
      <span className="font-bold text-gray-900">Trustpilot</span>
    </div>

    <div className="flex items-center mt-3">
      {[
        "https://i.pravatar.cc/60?img=12",
        "https://i.pravatar.cc/60?img=53",
        "https://i.pravatar.cc/60?img=65",
      ].map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Cliente"
          className="w-11 h-11 rounded-full border-2 border-white object-cover -ml-3 first:ml-0"
        />
      ))}
      <span className="w-11 h-11 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white -ml-3">
        +59K
      </span>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];

  const goPrev = useCallback(
    () =>
      setActiveIndex((prev) =>
        prev <= 0 ? testimonials.length - 1 : prev - 1,
      ),
    [],
  );
  const goNext = useCallback(
    () =>
      setActiveIndex((prev) =>
        prev >= testimonials.length - 1 ? 0 : prev + 1,
      ),
    [],
  );

  return (
    <div className="w-full bg-white py-16">
      <div className="w-10/12 mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start h-120">
        <TrustScorePanel />

        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-red-500" />
              <h3 className="text-red-500 text-sm font-semibold">
                Testimonials
              </h3>
              <div className="w-8 h-px bg-red-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              What Clients Say About Pillar
            </h2>
            <span className="block text-red-200 text-6xl font-serif leading-none mt-8">
              &ldquo;
            </span>
            <div className="space-y-6 mt-2">
              {testimonial.quotes.map((quote, i) => (
                <p
                  key={i}
                  className="text-xl font-semibold text-gray-900 leading-relaxed"
                >
                  &ldquo;{quote}&rdquo;
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 mt-8 pt-6">
            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-14 h-14 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                aria-label="Testimonio anterior"
              >
                <PiArrowLeft />
              </button>
              <button
                onClick={goNext}
                className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                aria-label="Siguiente testimonio"
              >
                <PiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
