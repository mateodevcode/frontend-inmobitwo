import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import BotonUsuario from "@/components/usuario/BotonUsuario";
import ModalUser from "@/components/modales/ModalUser";
import { RxHamburgerMenu } from "react-icons/rx";
import { items_menu } from "@/data/items_menu";
import { irArriba } from "@/utils/irArriba";

const HeaderInmobitwo = () => {
  const { openModalHamburguesa, setOpenModalHamburguesa, setOpenModalUser } =
    useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const segmento = location.pathname.split("/usuario/")[1];

  return (
    <header className="bg-white flex items-center w-full justify-between">
      <div className="flex items-center w-9/12 justify-between mx-auto">
        <div
          className="flex items-center gap-2 select-none py-5"
          onClick={() => {
            navigate("/");
            irArriba();
          }}
        >
          <div className="w-9 h-9">
            <img
              src="/logo/logo.png"
              alt="logo inmobitwo"
              className="object-center w-full h-full"
            />
          </div>
          <span className="text-2xl md:text-3xl tracking-tight text-black font-bold font-poppins">
            inmobitwo
          </span>
        </div>
        <div className="items-center gap-2 md:gap-8 font-semibold flex">
          <nav className="hidden md:flex items-center gap-6">
            {items_menu.slice(0, 3).map((item, i) => {
              return (
                <div
                  className={`flex flex-col items-center cursor-pointer select-none  hover:text-black active:scale-95 duration-75 transition ${item.id === segmento ? "font-bold text-black" : "text-black/60"}`}
                  onClick={() => navigate(`/usuario/${item.id}`)}
                  key={i}
                >
                  <div className="">{item.icon}</div>
                  <div className="text-sm">{item.label}</div>
                </div>
              );
            })}
          </nav>

          <BotonUsuario onClick={() => setOpenModalUser(true)} />

          <button
            className="p-2 hover:bg-rose-100 rounded-md flex md:hidden cursor-pointer select-none"
            onClick={() => {
              setOpenModalHamburguesa(!openModalHamburguesa);
            }}
          >
            <RxHamburgerMenu className="text-2xl text-black" />
          </button>
        </div>
      </div>
      <ModalUser />
    </header>
  );
};

export default HeaderInmobitwo;
