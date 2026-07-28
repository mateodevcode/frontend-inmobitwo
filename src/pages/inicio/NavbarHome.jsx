import { HiOutlineUser } from "react-icons/hi2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TbMenu4 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import BotonUsuario from "@/components/usuario/BotonUsuario";
import EnlaceNav from "./modales/EnlaceNav";
import { irArriba } from "../../utils/irArriba";
import { MENUS } from "../../data/menus";

const NavbarHome = () => {
  const { usuario, openModalUser, setOpenModalUser } = useAppContext();
  const navigate = useNavigate();

  function Columna({ heading, links }) {
    return (
      <div>
        <h4 className="text-[13px] font-bold text-black mb-4 tracking-wide font-poppins">
          {heading}
        </h4>
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-[15px] text-[#0057D9] hover:underline whitespace-nowrap"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white w-full border-b border-black/5 font-poppins">
      <div className="mx-auto w-11/12 md:w-9/12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
            className="flex items-center gap-2 select-none"
            onClick={() => {
              navigate("/");
              irArriba();
            }}
          >
            <div className="w-9 h-9">
              <img
                src="/logo/logo.png"
                alt="/logo inmobitwo"
                className="object-center w-full h-full"
              />
            </div>
            <span className="text-2xl md:text-3xl tracking-tight text-black font-bold">
              inmobitwo
            </span>
          </div>
          {/* Links */}
          <nav className="flex items-center gap-8 h-full">
            {Object.keys(MENUS).map((title) => (
              <EnlaceNav key={title} title={title}>
                {MENUS[title].map((col) => (
                  <Columna
                    key={col.heading}
                    heading={col.heading}
                    links={col.links}
                  />
                ))}
              </EnlaceNav>
            ))}
          </nav>
        </div>

        {/* Acciones */}
        <div className="hidden md:flex items-center gap-5">
          <button
            className="relative flex items-center gap-2 px-4 bg-transparent text-black h-9 rounded-md cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-black before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 border border-black/30"
            onClick={() => navigate("/info/publicar-anuncio")}
          >
            <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
              Pon tu anuncio gratis
            </p>
          </button>

          <button className="hidden md:flex items-center gap-1 text-sm text-black/80">
            🇪🇸
            <MdOutlineKeyboardArrowDown className="text-black/60" />
          </button>

          {usuario ? (
            <BotonUsuario onClick={() => setOpenModalUser(!openModalUser)} />
          ) : (
            <button
              className="flex items-center gap-2 text-sm font-semibold text-black/80 hover:text-tercero"
              onClick={() => navigate("/login")}
            >
              <HiOutlineUser className="text-lg" />
              Acceder
            </button>
          )}
        </div>

        {/* Menu hamburguesa */}
        <button className="border border-black/20 p-2 rounded-sm hover:bg-gray-100 cursor-pointer select-none flex md:hidden">
          <TbMenu4 className="text-2xl text-black" />
        </button>
      </div>
    </div>
  );
};

export default NavbarHome;
