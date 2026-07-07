// src/pages/Dashboard.jsx
import { useAppContext } from "@/context/AppContext.js";
import usePropiedades from "@/hooks/usePropiedades.js";
import useAuth from "@/hooks/useAuth.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { usuario, propiedades, loadingPropiedades, esSuperAdmin } =
    useAppContext();
  const { eliminarPropiedad } = usePropiedades();
  const { handleCerrarSesion } = useAuth();

  // Solo mostrar las propiedades del usuario actual
  const misPropiedades = propiedades.filter(
    (p) => p.publicado_por_id === usuario?.id,
  );

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta propiedad?")) return;
    await eliminarPropiedad(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Inmobi
        </Link>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-600">{usuario?.name}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {usuario?.rol}
          </span>
          {esSuperAdmin && (
            <Link
              to="/admin"
              className="text-sm text-purple-600 hover:underline"
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleCerrarSesion}
            className="text-sm text-red-500 hover:underline"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Mis propiedades
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {misPropiedades.length} propiedad
              {misPropiedades.length !== 1 ? "es" : ""}
            </p>
          </div>
          <Link
            to="/dashboard/nueva"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Nueva propiedad
          </Link>
        </div>

        {loadingPropiedades ? (
          <div className="text-center py-20 text-gray-400">Cargando...</div>
        ) : misPropiedades.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aún no has publicado ninguna propiedad.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {misPropiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center"
              >
                {propiedad.imagen_principal_url && (
                  <img
                    src={propiedad.imagen_principal_url}
                    alt={propiedad.titulo}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 truncate">
                    {propiedad.titulo}
                  </h2>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full
                    ${
                      propiedad.estado === "disponible"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {propiedad.estado}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/editar/${propiedad.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(propiedad.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
