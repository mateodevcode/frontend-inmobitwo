import { logo } from "@/data/logo";
import { items_organizacion, items_sidebar } from "@/data/items_sidebar";
import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useAppContext } from "@/context/AppContext";
import { getUsernameFromEmail } from "@/lib/getUsernameFromEmail";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { getInitials } from "@/lib/getInitials";

const Sidebar = () => {
  const [itemSelect, setItemSelect] = useState("feed");
  const { usuario, openModalUser, setOpenModalUser, setOpenModalSidebar } =
    useAppContext();
  const { name, email } = usuario;

  return (
    <div className="bg-white w-72 md:w-96 border-r border-black/20 font-poppins fixed h-svh left-0">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 p-4">
            <div className="border-black/10 border rounded-xl w-10 h-10 flex items-center justify-center shadow-xl">
              <img src={logo.src} alt={logo.alt} width={25} height={25} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-black font-semibold font-montserrat">
                Inmobitwo
              </h2>
              <p className="text-sm -mt-1.5 text-black/40">Inmobiliaria</p>
            </div>
          </div>
          <div className="w-full h-px bg-black/20" />
          <div className="p-2.5">
            {items_sidebar.map((item, i) => (
              <div
                className={`my-1 p-3 rounded-lg text-sm flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-all duration-75 border text-black relative ${
                  itemSelect === item.label
                    ? "bg-stone-100 border-black/10"
                    : "border-transparent hover:bg-stone-100 hover:border-black/10"
                }`}
                key={i}
                onClick={() => setItemSelect(item.label)}
              >
                <div className="text-lg">{item.icon}</div>
                {item.name}
                {item.label === "mensajes" && (
                  <div className="bg-[#FF1B1C] w-6 h-6 rounded-full flex items-center justify-center font-semibold text-white absolute right-3">
                    3
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <h3 className="uppercase font-semibold text-xs text-black/60 px-2">
              Mi organización
            </h3>
            <div className="px-2.5 pb-2.5">
              {items_organizacion.map((item, i) => (
                <div
                  className={`my-1 p-3 rounded-lg text-sm flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-all duration-75 border text-black ${
                    itemSelect === item.label
                      ? "bg-stone-100 border-black/10"
                      : "border-transparent hover:bg-stone-100 hover:border-black/10"
                  }`}
                  key={i}
                  onClick={() => setItemSelect(item.label)}
                >
                  <div className="text-lg">{item.icon}</div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex font-poppins items-center justify-between p-2">
          <div className="hover:bg-black/5 flex items-center justify-between w-full rounded-md p-2 cursor-pointer select-none border-transparent border hover:border-black/10">
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center">
                {getInitials(name)}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-black text-sm">
                  {formatFirstTwoNames(name)}
                </p>
                <p className="text-xs -mt-1">{getUsernameFromEmail(email)}</p>
              </div>
            </div>
            <div
              className="hover:bg-black/5 p-3 rounded-full cursor-pointer select-none"
              onClick={() => {
                setOpenModalUser(!openModalUser);
                setOpenModalSidebar(false);
              }}
            >
              <SlOptionsVertical className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
