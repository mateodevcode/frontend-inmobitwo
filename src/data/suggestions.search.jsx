import { FaDrawPolygon } from "react-icons/fa";
import { IoMdLocate } from "react-icons/io";
import { TfiMapAlt } from "react-icons/tfi";

export const SUGGESTIONS = [
  {
    id: "select-zone",
    label: "Seleccionar zonas en mapa",
    icon: TfiMapAlt,
    route: "/busqueda-multizona/venta-viviendas",
  },
  {
    id: "draw-zone",
    label: "Dibujar tu zona",
    icon: FaDrawPolygon,
    route: "/busqueda-multizona/alquiler-viviendas?draw=true",
  },
  {
    id: "around-me",
    label: "Buscar a tu alrededor",
    icon: IoMdLocate,
    route: "/point/alquiler-viviendas/43.40445/-6.54295/16/mapa-google",
  },
];
