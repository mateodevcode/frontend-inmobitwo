import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosMail } from "react-icons/io";
import { RiPhoneFill } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GrFacebookOption } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa6";

const CONTACT_SWITCH_MS = 3000;

const contactItems = [
  { icon: IoIosMail, text: "infomailexample@gmail.com" },
  { icon: RiPhoneFill, text: "+ 00 (123) 456 789 00" },
];

// Carrusel vertical (solo mobile): alterna email/teléfono en el mismo espacio,
// deslizando hacia arriba al salir y entrando desde abajo.
const MobileContactCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contactItems.length);
    }, CONTACT_SWITCH_MS);
    return () => clearInterval(timer);
  }, []);

  const current = contactItems[activeIndex];
  const Icon = current.icon;

  return (
    <div className="md:hidden relative h-4 overflow-hidden w-full max-w-[220px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center gap-2"
        >
          <Icon className="text-[#FF1B1C] shrink-0" />
          <p className="text-black/80 text-xs hover:text-rose-600 transition duration-300 cursor-pointer select-none truncate">
            {current.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TopHeader = () => {
  return (
    <div className="bg-[#FFF8F7] h-12 flex items-center justify-center w-full font-poppins">
      <div className="flex items-center justify-between w-10/12">
        {/* Mobile: carrusel vertical (email <-> teléfono) */}
        <MobileContactCarousel />

        {/* Desktop: email y teléfono lado a lado, sin animación */}
        <div className="hidden md:flex items-center gap-8 flex-row">
          <div className="flex items-center gap-2">
            <IoIosMail className="text-[#FF1B1C]" />
            <p className="text-black/80 text-xs hover:text-rose-600 transition duration-300 cursor-pointer select-none">
              infomailexample@gmail.com
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RiPhoneFill className="text-[#FF1B1C]" />
            <p className="text-black/80 text-xs hover:text-rose-600 transition duration-300 cursor-pointer select-none">
              + 00 (123) 456 789 00
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <a href="/" target="_blank">
              <FaWhatsapp className="text-black hover:text-[#FF1B1C] duration-500 transition" />
            </a>
            <a href="/" target="_blank">
              <GrFacebookOption className="text-black hover:text-[#FF1B1C] duration-500 transition" />
            </a>
            <a href="/" target="_blank">
              <FaInstagram className="text-black hover:text-[#FF1B1C] duration-500 transition" />
            </a>
          </div>
          <div className="w-px h-5 bg-black/20 md:flex hidden" />
          <div className="items-center gap-1 md:flex hidden">
            <p className="text-black/80 text-xs cursor-pointer select-none hover:text-black">
              English
            </p>
            <MdOutlineKeyboardArrowDown className="text-black/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
