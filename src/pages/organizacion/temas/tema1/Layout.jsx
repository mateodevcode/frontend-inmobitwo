// src/pages/organizacion/temas/tema1/Layout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = ({ organizacion, basePath }) => {
  const location = useLocation();
  const items = [
    { label: "Inicio", to: basePath || "/" },
    { label: "Sobre nosotros", to: `${basePath}/sobre-nosotros` },
    { label: "Contacto", to: `${basePath}/contacto` },
  ];

  return (
    <div>
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          {organizacion?.logo_url && (
            <img
              src={organizacion.logo_url}
              alt={organizacion.nombre}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <p className="font-bold">{organizacion?.nombre}</p>
          <nav className="ml-auto flex gap-1">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  location.pathname === item.to
                    ? "bg-black text-white"
                    : "hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <Outlet context={organizacion} />
    </div>
  );
};

export default Layout;
