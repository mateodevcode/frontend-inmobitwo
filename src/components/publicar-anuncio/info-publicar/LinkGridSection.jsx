import {
  BUSCAS_INMUEBLE_LINKS,
  PROFESIONAL_LINKS,
  TIENES_INMUEBLE_LINKS,
} from "@/data/info-publicar";
import { LinkColumn } from "@/components/publicar-anuncio/info-publicar/LinkColunm";

export function LinksGridSection() {
  return (
    <section className="py-14">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 w-10/12 mx-auto">
        <LinkColumn title="¿Buscas inmueble?" links={BUSCAS_INMUEBLE_LINKS} />
        <LinkColumn
          title="¿Tienes un inmueble?"
          links={TIENES_INMUEBLE_LINKS}
        />
        <LinkColumn
          title="¿Eres profesional inmobiliario?"
          links={PROFESIONAL_LINKS}
        />
      </div>
    </section>
  );
}
