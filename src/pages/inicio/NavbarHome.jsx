import { HiOutlineUser } from "react-icons/hi2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TbMenu4 } from "react-icons/tb";
import { links } from "@/data/links_inicio";
import { useNavigate } from "react-router-dom";

const NavbarHome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full border-b border-black/5 font-poppins">
      <div className="mx-auto w-11/12 md:w-9/12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-9 h-9">
              <img
                src="/logo/logo.png"
                alt="/logo inmobitwo"
                className="object-center w-full h-full"
              />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tight text-black">
              inmobitwo
            </span>
          </div>
          {/* Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="text-sm font-semibold text-black/80 hover:text-black transition-colors"
              >
                {link.label}
              </a>
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

          <button
            className="flex items-center gap-2 text-sm font-semibold text-black/80 hover:text-[#FF1B1C]"
            onClick={() => navigate("/login")}
          >
            <HiOutlineUser className="text-lg" />
            Acceder
          </button>
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
