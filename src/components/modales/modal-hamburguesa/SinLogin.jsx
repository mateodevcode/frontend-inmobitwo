import { IoPersonSharp } from "react-icons/io5";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const SinLogin = () => {
  const { setOpenModalHamburguesa } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <button
        className="flex items-center justify-center gap-2 p-3 rounded-md hover:bg-tercero/80 text-white font-semibold cursor-pointer select-none text-sm bg-tercero"
        onClick={() => {
          setOpenModalHamburguesa(false);
          navigate("/login");
        }}
        type="button"
      >
        <IoPersonSharp className="text-lg" />
        <span className="text-lg font-poppins">Acceder</span>
      </button>
      <button
        className="relative flex items-center justify-center gap-2 p-3 bg-transparent text-black font-semibold rounded-md cursor-pointer select-none border-2 border-black hover:border-tercero hover:text-tercero transition-colors hover:bg-tercero/10 duration-300"
        onClick={() => {
          setOpenModalHamburguesa(false);
          navigate("/info/publicar-anuncio");
        }}
        type="button"
      >
        <p className="text-lg relative z-10 font-poppins">
          Pon tu anuncio gratis
        </p>
      </button>
    </div>
  );
};

export default SinLogin;
