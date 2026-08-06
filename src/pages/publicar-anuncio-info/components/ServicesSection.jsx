import { ServiceCard } from "./ServiceCard";

export function ServicesSection() {
  return (
    <section className="bg-slate-100 md:py-14 py-8">
      <div className="mx-auto md:w-9/12 w-10/12">
        <h2 className="mb-8 md:text-3xl text-2xl font-bold text-slate-900">
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
