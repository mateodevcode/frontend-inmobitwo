// src/pages/organizacion/paginas/SobreNosotrosTemaSlot.jsx
import { useOutletContext } from "react-router-dom";
import { getTema } from "@/pages/organizacion/temas/temaRegistry.js";

const SobreNosotrosTemaSlot = () => {
  const organizacion = useOutletContext();
  const { SobreNosotros } = getTema(organizacion?.tema);
  return <SobreNosotros />;
};

export default SobreNosotrosTemaSlot;
