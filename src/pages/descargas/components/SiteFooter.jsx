import { Link } from "react-router-dom";
import { LogoLink } from "./Logo";

const columnas = [
  {
    titulo: "Producto",
    links: [
      { label: "Buscar casa", to: "/lista-propiedades" },
      { label: "Publicar anuncio", to: "/info/publicar-anuncio" },
      { label: "Hipotecas", to: "/" },
      { label: "Descargas", to: "/descargas" },
    ],
  },
  {
    titulo: "Empresas",
    links: [
      { label: "Planes", to: "/" },
      { label: "API para agencias", to: "/" },
      { label: "Casos de éxito", to: "/" },
    ],
  },
  {
    titulo: "Ayuda",
    links: [
      { label: "Centro de ayuda", to: "/" },
      { label: "Contacto", to: "/" },
      { label: "Estado del servicio", to: "/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-segundo/10 bg-primero font-poppins">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <LogoLink />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-segundo/60">
              No vendemos casas. Conectamos personas.
            </p>
          </div>
          {columnas.map((col) => (
            <div key={col.titulo}>
              <h3 className="text-sm font-semibold text-segundo">
                {col.titulo}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-segundo/60 transition-colors hover:text-segundo"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-segundo/10 pt-6 text-sm text-segundo/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} inmobitwo. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-5">
            <Link to="/" className="transition-colors hover:text-segundo">
              Privacidad
            </Link>
            <Link to="/" className="transition-colors hover:text-segundo">
              Términos
            </Link>
            <Link to="/" className="transition-colors hover:text-segundo">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
