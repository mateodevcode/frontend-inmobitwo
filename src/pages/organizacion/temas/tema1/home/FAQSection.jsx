import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiPlus, PiMinus } from "react-icons/pi";

const faqs = [
  {
    question: "What is Pillar real estate?",
    answer:
      "Most Islamic centers offer charity programs, counseling, and financial assistance for those in need. Non-Muslims are welcome to visit mosques. They should dress modestly and remove their shoes upon entering. You can attend community events, volunteer at the mosque, join study circles, or participate in outreach programs.",
  },
  {
    question: "How to work pillar all services?",
    answer:
      "Pillar connects you with verified agents, listings, and financing partners in one place. Create a free account, browse or list a property, and our team guides you through scheduling visits, negotiating, and closing the deal.",
  },
  {
    question: "What resources are available for interfaith dialogue?",
    answer:
      "We partner with local community centers to host open houses, panel discussions, and educational workshops. Check the Events page for upcoming sessions near you.",
  },
  {
    question: "What programs are available for developer?",
    answer:
      "Developers can access bulk listing tools, analytics dashboards, and priority support. Reach out to our partnerships team to get access to the developer portal.",
  },
  {
    question: "How can I contribute to the local real estate?",
    answer:
      "You can list a property, refer a friend, leave a verified review, or join our ambassador program to help other members navigate the local market.",
  },
];

const Squiggle = () => (
  <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
    <path
      d="M8 6C8 6 40 10 16 26C-8 42 52 46 28 62C4 78 52 74 52 74"
      stroke="black"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const SkylineBackground = () => (
  <svg
    className="absolute bottom-0 left-0 w-105 h-65 text-gray-900 opacity-[0.06] pointer-events-none"
    viewBox="0 0 420 260"
    fill="none"
  >
    <rect x="10" y="90" width="50" height="170" stroke="currentColor" />
    <rect x="70" y="130" width="40" height="130" stroke="currentColor" />
    <rect x="120" y="60" width="55" height="200" stroke="currentColor" />
    <rect x="185" y="150" width="35" height="110" stroke="currentColor" />
    <rect x="230" y="100" width="45" height="160" stroke="currentColor" />
    <rect x="285" y="170" width="30" height="90" stroke="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <rect
        key={i}
        x={20 + (i % 4) * 10}
        y={100 + Math.floor(i / 4) * 16}
        width="4"
        height="4"
        fill="currentColor"
      />
    ))}
  </svg>
);

const FaqItem = ({ item, index, isOpen, onToggle }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 p-6 text-left"
    >
      <span className="text-lg text-gray-900">
        <span className="font-semibold mr-2">{index + 1}.</span>
        <span className="font-semibold">{item.question}</span>
      </span>

      <span
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isOpen ? "bg-red-50 text-red-500" : "bg-stone-100 text-gray-900"
        }`}
      >
        {isOpen ? <PiMinus /> : <PiPlus />}
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-gray-500 leading-relaxed max-w-3xl">
            {item.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <div
      className="relative w-full py-16 overflow-hidden"
      style={{
        backgroundColor: "#f7f2ef",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 10px)",
      }}
    >
      <SkylineBackground />

      <div className="relative w-10/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-14 relative">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-px bg-red-500" />
            <h3 className="text-red-500 text-sm font-semibold">
              Frequently Ask Questions
            </h3>
            <div className="w-8 h-px bg-red-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            What would you like
            <br />
            to know about pillar?
          </h2>

          <div className="hidden lg:block absolute right-0 top-0">
            <Squiggle />
          </div>
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {faqs.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
