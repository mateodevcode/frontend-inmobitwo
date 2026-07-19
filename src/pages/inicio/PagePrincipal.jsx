import NavbarHome from "./NavbarHome";
import Hero from "./Hero";
import InfoCards from "./InfoCards";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";

const PageInicio = () => {
  return (
    <div className="w-full min-h-dvh bg-white">
      <NavbarHome />
      <Hero />
      <InfoCards />

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default PageInicio;
