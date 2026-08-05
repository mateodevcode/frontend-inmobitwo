import { HowToPublishHero } from "@/components/publicar-anuncio/info-publicar/HowToPublishHero";
import { PublishingGuideSection } from "@/components/publicar-anuncio/info-publicar/PublishingGuideSection";
import { AdvantagesSection } from "@/components/publicar-anuncio/info-publicar/AdvantagesSection";
import { ServicesSection } from "@/components/publicar-anuncio/info-publicar/ServicesSection";
import { LinksGridSection } from "@/components/publicar-anuncio/info-publicar/LinkGridSection";
import { SiteFooter } from "@/components/publicar-anuncio/info-publicar/SiteFooter";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import HeaderInmobitwo from "@/components/publicar-anuncio/info-publicar/HeaderInmobitwo";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";

const InfoPublicarAnuncio = () => {
  AdvantagesSection;

  return (
    <div className="flex flex-col font-montserrat">
      <HeaderInmobitwo />

      <HowToPublishHero />
      <PublishingGuideSection />
      <AdvantagesSection />
      <ServicesSection />
      <LinksGridSection />
      <SiteFooter />

      <ModalHamburguesa />

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default InfoPublicarAnuncio;
