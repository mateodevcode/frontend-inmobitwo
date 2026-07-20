import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import AnimatedTitle from "./AnimatedTitle";

const Hero = ({
  image = "/propiedades/chalet.jpg",
  propertyLabel = "Oficina en Alicante / Alacant, Alicante - 399.000 eur",
  propertyUrl = "#",
}) => {
  const [tab, setTab] = useState("comprar"); // "comprar" | "alquilar"

  return (
    <section className="w-full flex justify-center font-poppins">
      <div className="relative w-12/12 md:w-9/12">
        {/* Card de imagen, altura contenida (~150px) */}
        <div className="group relative w-full h-100 md:h-100 overflow-hidden">
          <img
            src={image}
            alt="Interior de una vivienda"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <a
            href={propertyUrl}
            className="absolute top-0 right-0 z-10 bg-white/80 text-blue-800 text-xs md:text-xs font-medium px-3 py-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:underline"
          >
            {propertyLabel}
          </a>
        </div>

        {/* Caja de búsqueda flotando centrada, cruzando el borde inferior de la card */}
        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 w-[95%] md:w-11/12 max-w-4xl bg-gray-100 px-6 py-6 md:px-10 md:py-8 rounded-sm shadow-xl border border-black/20">
          <AnimatedTitle
            texts={[
              "Mejor ciento volando",
              "Encuentra tu próximo hogar",
              "Vende más rápido con nosotros",
            ]}
            className="text-xl md:text-2xl font-semibold text-black text-center md:my-2 my-4"
            wrapperClassName="mb-4 md:mb-5"
          />

          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {/* Tabs Comprar / Alquilar */}
            <div className="flex">
              <button
                onClick={() => setTab("comprar")}
                className={`px-5 h-11 text-sm font-semibold border transition-colors ${
                  tab === "comprar"
                    ? "bg-white text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Comprar
              </button>
              <button
                onClick={() => setTab("alquilar")}
                className={`px-5 h-11 text-sm font-semibold border transition-colors ${
                  tab === "alquilar"
                    ? "bg-white text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Alquilar
              </button>
            </div>

            {/* Selector de tipo */}
            <button className="flex items-center justify-between gap-3 h-11 px-4 bg-white border border-black/10 text-sm text-black/80 md:min-w-35">
              Viviendas
              <MdOutlineKeyboardArrowDown className="text-black/60 text-lg" />
            </button>

            {/* Input de búsqueda */}
            <div className="flex items-center gap-2 h-11 px-4 bg-white border border-black/10 flex-1 md:min-w-55">
              <IoSearchOutline className="text-black/40 text-lg shrink-0" />
              <input
                type="text"
                placeholder="Escribe dónde buscas"
                className="w-full md:h-full outline-none text-sm placeholder:text-black/40 h-11"
              />
            </div>

            {/* Botón buscar */}
            <button className="relative flex items-center gap-2 px-8 bg-black text-white h-11 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 w-28">
              <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
                Buscar
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
