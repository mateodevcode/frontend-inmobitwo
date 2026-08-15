import { HowToPublishHero } from "@/pages/publicar-anuncio-info/components/HowToPublishHero";
import { PublishingGuideSection } from "@/pages/publicar-anuncio-info/components/PublishingGuideSection";
import { AdvantagesSection } from "@/pages/publicar-anuncio-info/components/AdvantagesSection";
import { ServicesSection } from "@/pages/publicar-anuncio-info/components/ServicesSection";
import { LinksGridSection } from "@/pages/publicar-anuncio-info/components/LinkGridSection";
import { SiteFooter } from "@/pages/publicar-anuncio-info/components/SiteFooter";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import HeaderInmobitwo from "@/pages/publicar-anuncio-info/components/HeaderInmobitwo";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";
import BarraNavegacionTauri from "../../components/barra-navegacion/BarraNavegacionTauri";

const InfoPublicarAnuncio = () => {
  AdvantagesSection;

  return (
    <div className="flex flex-col font-montserrat bg-primero">
      <HeaderInmobitwo />
      <HowToPublishHero />
      <PublishingGuideSection />
      <AdvantagesSection />
      <ServicesSection />
      <LinksGridSection />
      <SiteFooter />
      <ModalHamburguesa />

      <BarraNavegacionTauri />
      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default InfoPublicarAnuncio;
