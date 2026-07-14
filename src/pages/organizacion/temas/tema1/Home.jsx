// src/pages/organizacion/temas/tema1/Home.jsx
import { useOutletContext } from "react-router-dom";
import usePropiedadesOrganizacionData from "@/hooks/usePropiedadesOrganizacionData.js";

const Home = () => {
  const organizacionContext = useOutletContext();
  const slug = organizacionContext?.slug;
  const { organizacion, propiedades, loading, notFound, hasMore, cargarMas } =
    usePropiedadesOrganizacionData(slug);

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h1 className="text-xl font-bold mb-2">Organización no encontrada</h1>
      </div>
    );
  }

  if (loading && propiedades.length === 0) {
    return <div className="py-20 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-amber-400">
      {organizacion && (
        <header className="flex items-center gap-4 mb-8 border-b pb-6">
          {organizacion.logo_url && (
            <img
              src={organizacion.logo_url}
              alt={organizacion.nombre}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{organizacion.nombre}</h1>
            <p className="text-sm text-gray-500">
              {[organizacion.ciudad, organizacion.provincia]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </header>
      )}

      {propiedades.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          Esta organización todavía no ha publicado inmuebles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((p) => (
            <article key={p.id} className="border rounded-xl overflow-hidden">
              {p.imagen_principal_url && (
                <img
                  src={p.imagen_principal_url}
                  alt={p.titulo}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="font-semibold">{p.titulo}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  {p.tiempo_relativo}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={cargarMas}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
