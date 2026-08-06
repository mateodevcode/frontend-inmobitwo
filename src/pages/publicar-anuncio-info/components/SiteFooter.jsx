import { Apple, Smartphone } from "lucide-react";
import { AYUDA_LINKS, PAISES_LINKS, SOBRE_LINKS } from "@/data/info-publicar";
import { LinkColumn } from "@/pages/publicar-anuncio-info/components/LinkColunm";
import { LanguageSelect } from "@/pages/publicar-anuncio-info/components/LanguageSelect";
import Logo from "@/components/logo/Logo";

export function SiteFooter() {
  return (
    <footer className="bg-rose-50 md:py-12 py-8">
      <div className="mx-auto w-10/12">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="w-11/12">
            <Logo />
          </div>
          <LanguageSelect />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <LinkColumn title="Sobre inmobitwo" links={SOBRE_LINKS} />
          <LinkColumn title="Ayuda" links={AYUDA_LINKS} />
          <LinkColumn title="Otros países" links={PAISES_LINKS} />

          <div>
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              En tu móvil o tablet
            </h3>
            <div className="flex flex-col gap-2.5">
              <button className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-white">
                <Apple className="h-6 w-6" />
                <span className="text-left text-xs leading-tight">
                  Consíguelo en el
                  <br />
                  <strong className="text-sm">App Store</strong>
                </span>
              </button>
              <button className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-white">
                <Smartphone className="h-6 w-6" />
                <span className="text-left text-xs leading-tight">
                  Disponible en
                  <br />
                  <strong className="text-sm">Google Play</strong>
                </span>
              </button>
            </div>

            <div className="mt-5 flex gap-3 text-slate-500">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-slate-700"
              >
                ●
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-slate-700">
                ●
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-slate-700"
              >
                ●
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-base text-slate-500">
          <strong className="text-slate-900">inmobitwo</strong> Copyright ©
          2000-2026
        </p>
      </div>
    </footer>
  );
}
