import NavbarHome from "./NavbarHome";
import Hero from "./Hero";
import InfoCards from "./InfoCards";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import ModalUser from "./modales/ModalUser";
import { useAppContext } from "@/context/AppContext";

const PageInicio = () => {
  const { usuario } = useAppContext();

  return (
    <div className="w-full min-h-dvh bg-white">
      <NavbarHome />
      <Hero />
      <InfoCards />

      {usuario && <ModalUser />}

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default PageInicio;
