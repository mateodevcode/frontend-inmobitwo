// src/pages/PropiedadDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiBackend } from "@/api/apiBackend.js";

const PropiedadDetalle = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const res = await apiBackend(`/propiedades/${id}`);
      if (res.success) setPropiedad(res.data);
      setLoading(false);
    };
    cargar();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando...
      </div>
    );

  if (!propiedad)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Propiedad no encontrada.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Inmobi
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {propiedad.imagen_principal_url && (
          <img
            src={propiedad.imagen_principal_url}
            alt={propiedad.titulo}
            className="w-full h-72 object-cover rounded-2xl mb-6"
          />
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {propiedad.titulo}
        </h1>
        <span
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium mb-6
          ${
            propiedad.estado === "disponible"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {propiedad.estado}
        </span>

        {propiedad.galeria?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Galería
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {propiedad.galeria.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="w-full h-28 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        )}

        <Link
          to="/"
          className="inline-block mt-8 text-sm text-blue-600 hover:underline"
        >
          ← Volver
        </Link>
      </main>
    </div>
  );
};

export default PropiedadDetalle;
