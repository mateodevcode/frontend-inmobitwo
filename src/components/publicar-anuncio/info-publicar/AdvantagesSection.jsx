import { AdvantageColumn } from "./AdvantageColumn";

export function AdvantagesSection() {
  return (
    <section className="py-10">
      <div className="w-10/12 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">
          Ventajas de publicar en inmobitwo
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <AdvantageColumn title="Garantía de visibilidad">
            Los anuncios publicados en inmobitwo son visitados por millones de
            usuarios, lo que te da la oportunidad de vender o alquilar tu
            propiedad de manera más rápida y efectiva
          </AdvantageColumn>
          <AdvantageColumn title="La mejor experiencia">
            La APP de inmobitwo cuenta con múltiples funcionalidades que te
            ayudarán a gestionar tu publicación, y para quienes buscan inmueble,
            permite configurar alertas totalmente personalizadas para recibir de
            inmediato nuevos inmuebles
          </AdvantageColumn>
          <AdvantageColumn title="Multitud de productos para tu anuncio">
            Disponemos de una amplia variedad de herramientas para mejorar la
            posición de tu anuncio y ganar visibilidad
          </AdvantageColumn>
        </div>
      </div>
    </section>
  );
}
