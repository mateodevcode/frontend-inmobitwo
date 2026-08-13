import { useState } from "react";
import Hero from "@/pages/inicio/hero/Hero";
import InfoCards from "@/pages/inicio/info-cards/InfoCards";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import ModalUser from "@/components/modales/ModalUser";
import { useAppContext } from "@/context/AppContext";
import NavbarHome from "@/pages/inicio/navbar/NavbarHome";
// import { isTauri } from "../../utils/isTauri.js";

const TIPO_DEFAULT = { label: "Apartamento", slug: "apartamento" };

const PageInicio = () => {
  const { usuario } = useAppContext();
  const [tab, setTab] = useState("comprar");
  const [tipo, setTipo] = useState(TIPO_DEFAULT);
  // const isDesktop = isTauri();

  return (
    <div className="w-full min-h-dvh bg-white relative">
      {/* {isDesktop && (
        <div className="w-20 h-20 bg-amber-300">
          {" "}
          Hola mundo{" "}
        </div>
      )} */}

      <NavbarHome />
      <Hero tab={tab} setTab={setTab} tipo={tipo} setTipo={setTipo} />
      <InfoCards tab={tab} tipo={tipo} />

      {usuario && <ModalUser />}

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default PageInicio;
