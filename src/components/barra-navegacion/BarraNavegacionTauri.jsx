import { isTauri } from "../../utils/isTauri.js";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BarraNavegacionTauri = () => {
  const isDesktop = isTauri();
  const navigate = useNavigate();

  if (!isDesktop) return;

  return (
    <div className="h-10 absolute top-0 z-50 right-0 left-0 flex items-center justify-between px-2">
      <button
        className="text-segundo/60 p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition"
        onClick={() => navigate(-1)}
      >
        <IoArrowBackSharp className="text-xl" />
      </button>

      <div className="flex items-center gap-2">
        <button className="text-segundo/60 p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition">
          <MdKeyboardArrowLeft className="text-2xl" />
        </button>
        <button className="text-segundo/60 p-2 bg-segundo/3 rounded-md hover:bg-segundo/7 cursor-pointer select-none active:scale-95 duration-75 transition">
          <MdKeyboardArrowRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default BarraNavegacionTauri;
