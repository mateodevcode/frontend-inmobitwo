// src/pages/Admin.jsx
import { useAppContext } from "@/context/AppContext.js";
import useAuth from "@/hooks/useAuth.js";
import { Link } from "react-router-dom";

const Admin = () => {
  const { propiedades, loadingPropiedades } = useAppContext();
  const { handleCerrarSesion } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Inmobi
        </Link>
        <div className="flex gap-3 items-center">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            superadmin
          </span>
          <button
            onClick={handleCerrarSesion}
            className="text-sm text-red-500 hover:underline"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Panel de administración
        </h1>
        <p className="text-gray-500 mb-8">
          Vista global de todas las propiedades
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total propiedades</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {propiedades.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Disponibles</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {propiedades.filter((p) => p.estado === "disponible").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Otras</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">
              {propiedades.filter((p) => p.estado !== "disponible").length}
            </p>
          </div>
        </div>

        {loadingPropiedades ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Publicado por</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {propiedades.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">#{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.titulo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full
                        ${
                          p.estado === "disponible"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      #{p.publicado_por_id}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
