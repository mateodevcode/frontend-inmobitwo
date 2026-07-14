// src/pages/organizacion/paginas/HomeTemaSlot.jsx
import { useOutletContext } from "react-router-dom";
import { getTema } from "@/pages/organizacion/temas/temaRegistry.js";

const HomeTemaSlot = () => {
  const organizacion = useOutletContext();
  const { Home } = getTema(organizacion?.tema);
  return <Home />;
};

export default HomeTemaSlot;
