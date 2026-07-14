import { TbLayoutDashboard } from "react-icons/tb";
import { FaRegBuilding } from "react-icons/fa";
import { TiHeartOutline } from "react-icons/ti";
import { BsArrowUpRightSquare, BsChatSquareText } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FaChartBar } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

export const items_sidebar = [
  {
    label: "feed",
    icon: <TbLayoutDashboard />,
    url: "/",
    name: "Feed",
  },
  {
    label: "propiedades",
    icon: <FaRegBuilding />,
    url: "/lista-propiedades",
    name: "Propiedades",
  },
  {
    label: "guardados",
    icon: <TiHeartOutline />,
    url: "/usuario/favoritos",
    name: "Guardados",
  },
  {
    label: "mensajes",
    icon: <BsChatSquareText />,
    url: "/usuario/mis-mensajes",
    name: "Mensajes",
  },
  {
    label: "alertas",
    icon: <IoIosNotificationsOutline />,
    url: "/usuarios/notificaciones",
    name: "Alertas",
  },
];

export const items_organizacion = [
  {
    label: "agentes",
    icon: <LiaUserFriendsSolid />,
    url: "/organizaciones/agentes",
    name: "Agentes",
  },
  {
    label: "estadisticas",
    icon: <FaChartBar />,
    url: "/organizaciones/estadisticas/id",
    name: "Estadísticas",
  },
  {
    label: "ajustes",
    icon: <CiSettings />,
    url: "/organizaciones/ajustes",
    name: "Ajustes",
  },
];

export const items_admin = [
  {
    label: "rutas",
    icon: <BsArrowUpRightSquare />,
    url: "/admin/rutas",
    name: "Rutas",
  },
];
