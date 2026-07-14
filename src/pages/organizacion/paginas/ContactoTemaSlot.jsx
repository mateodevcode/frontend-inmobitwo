// src/pages/organizacion/paginas/ContactoTemaSlot.jsx
import { useOutletContext } from "react-router-dom";
import { getTema } from "@/pages/organizacion/temas/temaRegistry.js";

const ContactoTemaSlot = () => {
  const organizacion = useOutletContext();
  const { Contacto } = getTema(organizacion?.tema);
  return <Contacto />;
};

export default ContactoTemaSlot;
