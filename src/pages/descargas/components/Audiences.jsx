import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";

const audiencias = [
  {
    Icon: IoPersonOutline,
    titulo: "Para personas",
    texto:
      "Encuentra tu próxima casa, guarda favoritos y habla directamente con los propietarios. Tus 2 primeros anuncios son gratis.",
    cta: "Empezar a buscar",
    to: "/lista-propiedades",
  },
  {
    Icon: PiBuildingOfficeLight,
    titulo: "Para empresas",
    texto:
      "Gestiona carteras completas, coordina a tu equipo y publica en lote. Herramientas pensadas para agencias e inmobiliarias.",
    cta: "Ver planes para empresas",
    to: "/",
  },
];

export function Audiences() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 font-poppins">
      <div className="grid gap-5 md:grid-cols-2">
        {audiencias.map(({ Icon, titulo, texto, cta, to }) => (
          <div
            key={titulo}
            className="flex flex-col rounded-3xl border border-segundo/10 bg-primero p-8"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-septimo text-tercero">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-segundo">
              {titulo}
            </h3>
            <p className="mt-2 flex-1 leading-relaxed text-segundo/60">
              {texto}
            </p>
            <Link
              to={to}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-tercero underline-offset-4 hover:underline"
            >
              {cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
