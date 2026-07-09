import { SlOptionsVertical } from "react-icons/sl";
import { getUsernameFromEmail } from "@/lib/getUsernameFromEmail";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { getInitials } from "@/lib/getInitials";
import { useAppContext } from "@/context/AppContext";

const FooterSidebar = () => {
  const { usuario, openModalUser, setOpenModalUser, setOpenModalSidebar } =
    useAppContext();
  const { name, email } = usuario;

  return (
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
  );
};

export default FooterSidebar;
