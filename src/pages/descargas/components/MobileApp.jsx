import { Smartphone, Bell, MapPin } from "lucide-react";
import { BiLogoPlayStore } from "react-icons/bi";
import { RiAppleLine } from "react-icons/ri";

const ventajas = [
  { Icon: Bell, texto: "Avisos al instante de nuevos inmuebles y mensajes" },
  { Icon: MapPin, texto: "Busca por zonas dibujando directamente en el mapa" },
  { Icon: Smartphone, texto: "Publica tu anuncio desde el móvil en minutos" },
];

export function MobileApp() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 font-poppins">
      <div className="overflow-hidden rounded-4xl border border-segundo/10 bg-tercero/10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-primero px-4 py-1.5 text-sm font-medium text-tercero">
              <Smartphone className="size-4" />
              También en tu bolsillo
            </span>
            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold tracking-tight text-segundo sm:text-4xl">
              Llévate inmobitwo en el móvil
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-segundo/60">
              Gestiona tus inmuebles y no pierdas ninguna oportunidad estés
              donde estés. Disponible para iOS y Android.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {ventajas.map(({ Icon, texto }) => (
                <li key={texto} className="flex items-center gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primero text-tercero">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-segundo">
                    {texto}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-md bg-segundo/80 px-5 py-3 text-primero transition-transform hover:-translate-y-0.5"
              >
                <RiAppleLine className="size-6" />
                <span className="text-left leading-tight">
                  <span className="block text-[0.65rem] uppercase tracking-wide opacity-70">
                    Descárgalo en
                  </span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-md bg-segundo/80 px-5 py-3 text-primero transition-transform hover:-translate-y-0.5"
              >
                <BiLogoPlayStore className="size-6" />
                <span className="text-left leading-tight">
                  <span className="block text-[0.65rem] uppercase tracking-wide opacity-70">
                    Disponible en
                  </span>
                  <span className="block text-sm font-semibold">
                    Google Play
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center px-8 pt-8 lg:pt-0">
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-4xl border-2 border-dashed border-tercero/30 bg-primero/60 px-6 py-14 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-septimo text-tercero">
                <Smartphone className="size-8" />
              </span>
              <p className="font-display text-lg font-bold text-segundo">
                App móvil próximamente
              </p>
              <p className="max-w-[16rem] text-sm leading-relaxed text-segundo/60">
                Mientras tanto, descarga la versión de escritorio y usa
                inmobitwo desde tu ordenador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
