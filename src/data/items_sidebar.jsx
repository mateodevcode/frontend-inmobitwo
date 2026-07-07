import { TbLayoutDashboard } from "react-icons/tb";
import { FaRegBuilding } from "react-icons/fa";
import { TiHeartOutline } from "react-icons/ti";
import { BsChatSquareText } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FaChartBar } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

export const items_sidebar = [
  {
    label: "feed",
    icon: <TbLayoutDashboard />,
    url: "#",
    name: "Feed",
  },
  {
    label: "propiedades",
    icon: <FaRegBuilding />,
    url: "#",
    name: "Propiedades",
  },
  {
    label: "guardados",
    icon: <TiHeartOutline />,
    url: "#",
    name: "Guardados",
  },
  {
    label: "mensajes",
    icon: <BsChatSquareText />,
    url: "#",
    name: "Mensajes",
  },
  {
    label: "alertas",
    icon: <IoIosNotificationsOutline />,
    url: "#",
    name: "Alertas",
  },
];

export const items_organizacion = [
  {
    label: "agentes",
    icon: <LiaUserFriendsSolid />,
    url: "#",
    name: "Agentes",
  },
  {
    label: "estadisticas",
    icon: <FaChartBar />,
    url: "#",
    name: "Estadísticas",
  },
  {
    label: "ajustes",
    icon: <CiSettings />,
    url: "#",
    name: "Ajustes",
  },
];
