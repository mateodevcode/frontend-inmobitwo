import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { logo } from "@/data/logo";
import { getInitials } from "@/lib/getInitials";
import { RxHamburgerMenu } from "react-icons/rx";
import { items_menu } from "@/data/items_menu";

const HeaderInmobitwo = () => {
  const { usuario, openModalHamburguesa, setOpenModalHamburguesa } =
    useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const segmento = location.pathname.split("/usuario/")[1];

  return (
    <header className="bg-stone-50 flex items-center w-full justify-between">
      <div className="flex items-center w-11/12 justify-between mx-auto">
        <div
          className="py-5 flex items-center gap-4 cursor-pointer select-none"
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
        >
          <div className="border-black/10 border rounded-xl w-10 h-10 flex items-center justify-center shadow-xl">
            <img src={logo.src} alt={logo.alt} width={25} height={25} />
          </div>
          <span className="font-montserrat text-2xl font-bold tracking-tight text-black md:text-3xl">
            inmobitwo
          </span>
        </div>
        <nav className="items-center gap-2 md:gap-10 font-semibold flex">
          <div className="hidden md:flex items-center gap-6">
            {items_menu.slice(0, 3).map((item, i) => {
              return (
                <div
                  className={`flex flex-col items-center cursor-pointer select-none  hover:text-black active:scale-95 duration-75 transition ${item.id === segmento ? "font-bold text-black" : "text-black/60"}`}
                  onClick={() => navigate(`/usuario/${item.id}`)}
                  key={i}
                >
                  <div className="text-lg">{item.icon}</div>
                  <div>{item.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 items-center">
            <div
              className="w-10 h-10 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center hover:shadow shadow-black/10 cursor-pointer select-none active:scale-95 duration-75 transition"
              onClick={() => {
                navigate("/usuario/tus-datos/perfil");
                window.scrollTo(0, 0);
              }}
            >
              {getInitials(usuario?.name)}
            </div>
          </div>

          <button
            className="p-2 hover:bg-rose-100 rounded-md flex md:hidden cursor-pointer select-none"
            onClick={() => {
              setOpenModalHamburguesa(!openModalHamburguesa);
            }}
          >
            <RxHamburgerMenu className="text-2xl text-black" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HeaderInmobitwo;
