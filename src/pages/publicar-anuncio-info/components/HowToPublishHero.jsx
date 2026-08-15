import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { irArriba } from "@/utils/irArriba";

export function HowToPublishHero() {
  const navigate = useNavigate();

  const bullets = [
    <>
      Tus <strong>2 primeros anuncios son gratis</strong>. Si son de
      habitaciones, puedes publicar hasta 5 anuncios gratis
    </>,
    <>
      Tienes acceso a un área privada donde puedes gestionar tu anuncio y los
      contactos recibidos
    </>,
    <>
      Puedes resolver dudas, intercambiar información y concertar visitas de
      manera eficiente con nuestro chat
    </>,
  ];

  return (
    <section className="bg-septimo/50 md:py-10 py-5">
      <div className="mx-auto w-11/12 md:w-8/12 lg:w-9/12 max-w-4xl flex flex-col gap-4 rounded-lg bg-primero md:p-10 p-7 lg:flex-row md:items-center md:justify-between md:gap-12 shadow-lg shadow-segundo/20">
        <div className="flex-1">
          <h1 className="mb-4 font-bold text-slate-900 md:text-3xl text-2xl">
            Cómo poner un anuncio en inmobitwo
          </h1>

          <ul className="mb-6 flex flex-col gap-3">
            {bullets.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                />
                <p className="text-base text-slate-900">{text}</p>
              </li>
            ))}
          </ul>

          <p className="mb-4 text-sm text-slate-900">
            Para vender o alquilar más rápido{" "}
            <a href="#" className="text-blue-600 hover:underline">
              contacta con una agencia inmobiliaria
            </a>
          </p>

          <button
            className="relative flex items-center justify-center gap-2 px-8 bg-black text-white h-11 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 rounded-md w-full"
            type="button"
            onClick={() => {
              navigate("/info/publicar-anuncio/publicar");
              irArriba();
            }}
          >
            <p className="text-base relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
              Pon tu anuncio
            </p>
          </button>

          <p className="mt-5 text-sm text-slate-900">
            ¿Eres profesional inmobiliario? Conoce nuestras{" "}
            <a href="#" className="text-blue-600 hover:underline">
              ventajas para profesionales
            </a>
          </p>
        </div>

        {/* Ilustración simplificada (sustituir por el SVG/imagen real de marca) */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-64 w-40 -rotate-12 flex-col gap-2 rounded-3xl border-4 border-slate-900 bg-white p-3 shadow-lg">
            <div className="h-16 rounded-lg bg-rose-200" />
            <div className="h-2 w-3/4 rounded bg-slate-200" />
            <div className="h-2 w-1/2 rounded bg-slate-200" />
            <div className="ml-auto h-10 w-3/4 rounded-lg bg-rose-200" />
            <div className="h-2 w-2/3 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
