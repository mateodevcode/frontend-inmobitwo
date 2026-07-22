import FiltrosPrincipal from "./FiltrosPrincipal";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import NavbarListaPropiedades from "./NavbarListaPropiedades";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { SiOpenstreetmap } from "react-icons/si";
import { useEffect, useState } from "react";
import ListadoDePropiedades from "./ListadoDePropiedades";

const ListaPropiedades = () => {
  const tabs = ["Comprar", "Alquilar", "Vacacional"];
  const [selected, setSelected] = useState(tabs[0]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const logWidth = () => console.log("Ancho actual:", window.innerWidth);
    logWidth(); // log inicial
    window.addEventListener("resize", logWidth);
    return () => window.removeEventListener("resize", logWidth);
  }, []);

  return (
    <div className="flex items-center flex-col w-full font-poppins">
      <NavbarListaPropiedades />
      <div className="w-[90%] 2xl:w-10/12 h-48 flex flex-col justify-between">
        <div className="flex items-center gap-2 mt-2 text-sm">
          <div className="text-blue-600">inmobitwo</div>
          <MdOutlineKeyboardArrowRight />
          <div className="relative">
            <div className="text-blue-600">Atlantico</div>
            <div className="absolute top-6">1.826</div>
          </div>
          <MdOutlineKeyboardArrowRight />
          <div className="relative">
            <div className="text-segundo">Barranquilla</div>
            <div className="absolute top-6">1.826</div>
          </div>
          <div>
            <MdArrowDropDown />
          </div>
        </div>

        <div className="w-full h-28 flex">
          {/* Boton de suscripcion */}
          <div className="bg-septimo w-[25%] h-full rounded-sm flex items-center justify-center flex-col gap-4">
            <h3 className="text-segundo text-sm font-semibold">
              Nuevos anuncios en tu email
            </h3>
            <button className="relative flex items-center justify-center gap-2 px-8 bg-black text-white h-11 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 w-10/12 rounded-md">
              <IoNotificationsSharp className="text-lg relative z-10 group-hover:text-white transition-colors duration-300 font-semibold" />
              <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
                Guardar búsqueda
              </p>
            </button>
          </div>

          {/* Header busqueda */}
          <div className="w-[75%] h-full flex flex-col justify-between">
            <div className="flex gap-4 mx-4">
              <div className="flex flex-wrap items-center gap-1 font-semibold text-2xl text-segundo">
                <p>751</p>
                <p>casas y pisos en alquiler en </p>
                <p>Oviedo,</p>
                <p> Asturias</p>
              </div>
              <div className="flex items-center gap-2 text-blue-500 font-semibold text-base min-w-48 cursor-pointer select-none hover:text-blue-600">
                <SiOpenstreetmap />
                <p className="">Modificar zona</p>
              </div>
            </div>

            <div className="h-9 relative flex gap-2 mx-4">
              {tabs.map((tab) => {
                const isActive = tab === selected || tab === hovered;

                return (
                  <div
                    key={tab}
                    onClick={() => setSelected(tab)}
                    onMouseEnter={() => setHovered(tab)}
                    onMouseLeave={() => setHovered(null)}
                    className="px-4 cursor-pointer relative"
                  >
                    <p
                      className={`font-semibold select-none hover:text-tercero text-cuarto ${
                        isActive ? "text-tercero" : "text-cuarto"
                      }`}
                    >
                      {tab}
                    </p>

                    <span
                      className="absolute left-0 bottom-0 h-0.5 w-full bg-tercero origin-left transition-transform duration-300 ease-out z-10"
                      style={{
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </div>
                );
              })}

              {/* Línea final fija */}
              <div className="h-0.5 w-full bg-gray-300 absolute bottom-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-100">
        <div className="flex items-start w-[90%] 2xl:w-10/12 mx-auto">
          <FiltrosPrincipal />
          <ListadoDePropiedades />
        </div>
      </div>

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default ListaPropiedades;
