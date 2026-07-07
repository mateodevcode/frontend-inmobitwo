import { FaRegHeart } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";

export const items_menu = [
  {
    label: "Mis anuncios",
    id: "mis-anuncios",
    icon: <LuBuilding2 className="text-2xl" />,
  },
  {
    label: "Favoritos",
    id: "favoritos",
    icon: <FaRegHeart className="text-2xl" />,
  },
  {
    label: "Chat",
    id: "chat",
    icon: <IoChatboxEllipsesOutline className="text-2xl" />,
  },
  {
    label: "Notificaciones",
    id: "notificaciones",
    icon: <IoMdNotificationsOutline className="text-2xl" />,
  },
];
