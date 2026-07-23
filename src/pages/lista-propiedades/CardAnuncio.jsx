import { BsFillGeoAltFill } from "react-icons/bs";
import { FaArchway } from "react-icons/fa6";
import { FiVideo } from "react-icons/fi";
import { GoHeart } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi2";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { PiChats } from "react-icons/pi";

const CardAnuncio = ({ anu }) => {
  return (
    <div className="flex items-center h-64 w-full rounded-md shadow-lg hover:shadow-xl shadow-black/10 transition duration-300 group">
      <div className="w-[35%] h-full bg-amber-400 rounded-l-md relative">
        <img
          src="/propiedades/chalet.jpg"
          alt="imagen propiedad"
          className="w-full h-full object-cover rounded-l-md"
        />

        <div className="absolute left-2 bottom-2 flex items-center justify-center gap-2">
          <div className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <FaArchway className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
          <div className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <FiVideo className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
          <div className="bg-primero/60 group-hover:bg-primero rounded-xs p-2.5 flex items-center justify-center transition-colors duration-300 cursor-pointer select-none">
            <BsFillGeoAltFill className="text-sm text-segundo/60 group-hover:text-segundo transition-colors duration-300" />
          </div>
        </div>

        <div className="absolute left-1 top-1/2 hover:bg-primero/80 rounded-full p-1.5 hover:text-black text-primero transition duration-300 cursor-pointer select-none">
          <MdOutlineKeyboardArrowLeft className="text-3xl shadow-2xl shadow-black" />
        </div>
        <div className="absolute right-1 text-3xl top-1/2 hover:bg-primero/80 rounded-full p-1.5 hover:text-black text-primero transition duration-300 cursor-pointer select-none">
          <MdOutlineKeyboardArrowRight className="shadow-2xl shadow-black" />
        </div>

        <div className="bg-black/70 absolute bottom-2 right-2 p-1.5 px-2 rounded-md">
          <span className="text-white/80 font-semibold text-sm">1/10</span>
        </div>
      </div>
      <div className="w-[65%] bg-primero h-full rounded-r-md relative pb-3 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Head */}
          <div className="flex items-center justify-between w-full">
            <h2 className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer select-none px-4 pt-2">
              Piso en calle general Elorza, Milan-pumarin, Oviedo
            </h2>
            <div className="mx-6 border border-segundo/10 w-32 h-16">
              <img
                src="/logo/logo-hor.png"
                alt="logo inmobitwo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* body */}
          <div className="px-4">
            <div className="flex items-center gap-2 text-black">
              <p className="text-2xl font-bold">850</p>
              <p>$/mes</p>
            </div>

            <div className="text-sm flex items-center gap-2">
              <p>
                Garaje incluido 2 hab. 85 m² 7ª planta exterior con ascensor
              </p>
              <p className="text-red-600">5 horas</p>
            </div>

            <div className="text-sm mt-2">
              ALQUILER TEMPORAL ALQUILER AMUEBLADO TRES DORMITORIOS EN CIUDAD
              NARANCO Próximo a la estación de autobuses y trenes y a un paso
              del Colegio Santa María del Naranco. Rodeado
            </div>

            <div className="flex items-center gap-2 text-xs mt-2">
              <div className="bg-amber-100 px-2 py-0.5">Alquiler temporada</div>
              <div className="bg-amber-100 px-2 py-0.5">Apartamento</div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-blue-600 cursor-pointer select-none">
            <PiChats className="text-lg" />
            <p className="text-sm font-semibold hover:underline">Contactar</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="cursor-pointer select-none">
              <HiOutlineTrash className="text-lg text-blue-600" />
            </div>
            <div className="cursor-pointer select-none">
              <GoHeart className="text-lg text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAnuncio;
