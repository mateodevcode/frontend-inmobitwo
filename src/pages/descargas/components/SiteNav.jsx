import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoLink } from "./Logo";

const links = [
  { label: "Propietarios", to: "/info/publicar-anuncio" },
  { label: "Buscas casa", to: "/lista-propiedades" },
  { label: "Hipotecas", to: "/" },
  { label: "Descargas", to: "/descargas" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-segundo/10 bg-primero/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LogoLink className="shrink-0" />

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium text-segundo/60 transition-colors hover:text-segundo"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-segundo/60 transition-colors hover:text-segundo"
            aria-label="Cambiar idioma, actual español"
          >
            <span aria-hidden="true">🇪🇸</span>
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-segundo transition-colors hover:text-tercero"
          >
            <User className="size-4" aria-hidden="true" />
            Acceder
          </Link>
          <Link
            to="/info/publicar-anuncio"
            className="rounded-md bg-tercero px-5 py-2.5 text-sm font-semibold text-primero font-poppins shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Pon tu anuncio gratis
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-xl text-segundo lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-segundo/10 bg-primero px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-segundo hover:bg-segundo/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-segundo/10 pt-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-full border border-segundo/10 px-5 py-2.5 text-sm font-semibold text-segundo"
            >
              <User className="size-4" aria-hidden="true" />
              Acceder
            </Link>
            <Link
              to="/info/publicar-anuncio"
              className="rounded-full bg-tercero px-5 py-2.5 text-center text-sm font-semibold text-primero"
            >
              Pon tu anuncio gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
