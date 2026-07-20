import { ServiceCard } from "./ServiceCard";

export function ServicesSection() {
  return (
    <section className="bg-slate-100 py-14">
      <div className="mx-auto w-9/12">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">
          Algunos servicios para facilitarte la venta o alquiler de tu inmueble
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ServiceCard
            title="Te recomendamos una agencia para un trato personalizado"
            linkLabel="Ver listados de agencias expertas en tu zona"
          >
            Podemos ayudarte en todo, pero un profesional inmobiliario estudiará
            y se adaptará a tu caso individual
          </ServiceCard>
          <ServiceCard
            title="¿Eres profesional inmobiliario?"
            linkLabel="Conocer las ventajas para profesionales"
          >
            Ofrecemos variedad de servicios y precios adaptados a tus
            necesidades. Formaciones actualizadas y software de gestión
            inmobiliaria. Además, cuentas con un equipo de fotógrafos y más
            servicios de apoyo a tu disposición
          </ServiceCard>
        </div>
      </div>
    </section>
  );
}
