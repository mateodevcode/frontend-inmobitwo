import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { CgMenuLeft } from "react-icons/cg";

const items = [
  {
    label: "Inicio",
    url: "",
    id: "inicio",
    arrow: false,
  },
  {
    label: "Nosotros",
    url: "",
    id: "nosotros",
    arrow: false,
  },
  {
    label: "Propiedades",
    url: "",
    id: "propiedades",
    arrow: true,
  },
  {
    label: "Contactanos",
    url: "",
    id: "contactanos",
    arrow: false,
  },
];

const Navbar = () => {
  return (
    <div className="bg-white h-24 w-full flex items-center justify-center font-poppins">
      <div className="flex w-11/12 md:w-10/12 px-4 md:px-8 items-center justify-between">
        <div className="w-44 md:w-60 h-16 flex items-center justify-center">
          <div className="w-44 md:w-60">
            <img
              src="/logo/logo-hor.png"
              alt="logo"
              className
              className="h-full w-full"
            />
          </div>
        </div>

        <nav className="md:flex items-center justify-center hidden">
          <ul className="flex items-center gap-12">
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  className="text-black/80 flex items-center gap-2"
                >
                  {item.label}
                  {item.arrow && (
                    <MdOutlineKeyboardArrowDown className="text-black/80 text-lg" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-end md:items-center gap-6">
          <button className="relative hidden md:flex items-center gap-2 px-4 bg-black/90 text-white h-9 rounded-md cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-rose-600 before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0">
            <IoHomeOutline className="relative z-10" />
            <p className="text-sm relative z-10">Agregar</p>
          </button>

          <div className="border border-black/30 hover:bg-rose-600 hover:text-white hover:border-rose-700 duration-300 transition rounded-md w-9 h-9 flex items-center justify-center">
            <CgMenuLeft />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
