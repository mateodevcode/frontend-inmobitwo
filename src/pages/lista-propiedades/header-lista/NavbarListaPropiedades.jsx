import { HiOutlineUser } from "react-icons/hi2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TbMenu4 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import BotonUsuario from "@/pages/usuario/BotonUsuario";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";
import EnlaceNav from "@/pages/inicio/modales/EnlaceNav";
import Logo from "@/components/logo/Logo";
import { MENUS } from "@/data/menus";
import Columna from "@/pages/inicio/components/Columna";

const NavbarListaPropiedades = () => {
  const {
    usuario,
    openModalUser,
    setOpenModalUser,
    openModalHamburguesa,
    setOpenModalHamburguesa,
  } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full border-b border-black/5 font-poppins">
      <div className="mx-auto w-10/12 h-20 flex items-center justify-between">
        <div className="flex items-end gap-8">
          <Logo />
          <nav className="xl:flex items-center gap-8 h-full hidden">
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

        <div className="flex items-center gap-5">
          <button
            className="relative hidden md:flex items-center gap-2 px-4 bg-transparent text-black h-9 rounded-md cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-black before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 border border-black/30"
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
          <button
            className="border border-black/20 p-2 rounded-sm hover:bg-gray-100 cursor-pointer select-none flex xl:hidden"
            onClick={() => setOpenModalHamburguesa(!openModalHamburguesa)}
          >
            <TbMenu4 className="text-2xl text-black" />
          </button>
        </div>
      </div>
      <ModalHamburguesa />
    </div>
  );
};

export default NavbarListaPropiedades;
