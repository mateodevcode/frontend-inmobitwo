import DetalleDeAnuncio from "@/components/usuario/tus-anuncios/anuncio/DetalleDeAnuncio";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { SiteFooter } from "@/components/publicar-anuncio/info-publicar/SiteFooter";

const Anuncio = () => {
  return (
    <div>
      <DetalleDeAnuncio />
      <SiteFooter />
      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default Anuncio;
