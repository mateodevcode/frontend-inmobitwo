// src/pages/organizacion/PaginaOrganizacion.jsx
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTenant } from "@/context/TenantContext.js";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

// ────────────────────────────────────────────────────────────────
// Esta página sirve para DOS rutas distintas con el mismo componente:
//   1. Dominio principal:  inmobitwo.com/inmobiliarias/:slug
//      -> el slug viene de useParams()
//   2. Dominio propio:     www.inmobiliariaoviedo.com/
//      -> el slug viene de organizacionActual (ya resuelto por TenantProvider)
// ────────────────────────────────────────────────────────────────
const PaginaOrganizacion = () => {
  const { slug: slugParam } = useParams();
  const { organizacionActual } = useTenant();
  const slug = slugParam || organizacionActual?.slug || null;

  const { cargarPropiedadesOrganizacion } = useOrganizaciones();

  const [organizacion, setOrganizacion] = useState(organizacionActual || null);
  const [propiedades, setPropiedades] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const cargar = useCallback(
    async (cursorActual = null) => {
      if (!slug) return;
      setLoading(true);

      const res = await cargarPropiedadesOrganizacion(slug, cursorActual);

      if (res.success) {
        setOrganizacion(res.data.organizacion);
        setPropiedades((prev) =>
          cursorActual ? [...prev, ...res.data.data] : res.data.data,
        );
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      } else {
        setNotFound(true);
      }

      setLoading(false);
    },
    [slug, cargarPropiedadesOrganizacion],
  );

  useEffect(() => {
    setPropiedades([]);
    setCursor(null);
    setHasMore(true);
    setNotFound(false);
    if (slug) cargar(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!slug) return null;

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h1 className="text-xl font-bold mb-2">Organización no encontrada</h1>
        <p className="text-gray-500">
          Puede que aún no esté aprobada o que la URL sea incorrecta.
        </p>
      </div>
    );
  }

  if (loading && propiedades.length === 0) {
    return <div className="py-20 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            {organizacion.telefono && (
              <p className="text-sm text-gray-500">{organizacion.telefono}</p>
            )}
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
            onClick={() => cargar(cursor)}
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

export default PaginaOrganizacion;
