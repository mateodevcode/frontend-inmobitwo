// src/pages/admin/AdminRutasPages.jsx
import { Link } from "react-router-dom";
import { rutasFrontend, rutasBackend } from "@/data/mapaRutas.js";

const AdminRutasPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white font-montserrat">
      <h1 className="text-xl font-bold mb-1 text-black">Mapa de rutas</h1>
      <p className="text-sm text-black/50 mb-6">
        Frontend: clickeable, navega de verdad. Backend: informativo, no es
        navegable.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─────────────────────────── FRONTEND ─────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold uppercase text-black/60 mb-3">
            Frontend
          </h2>
          <div className="space-y-4">
            {rutasFrontend.map((grupo) => (
              <div key={grupo.seccion} className="border rounded-xl p-3">
                <h3 className="text-xs font-semibold uppercase text-black/40 mb-2">
                  {grupo.seccion}
                </h3>
                <div className="space-y-1">
                  {grupo.items.map((item) =>
                    item.param ? (
                      <div
                        key={item.path}
                        className="flex justify-between items-center px-2 py-1.5 rounded-lg text-sm text-black/40"
                        title="Requiere un parámetro real (id/slug), no se puede navegar directo"
                      >
                        <span className="font-montserrat text-xs">
                          {item.path}
                        </span>
                        <span className="text-[11px]">
                          {item.nombre} · {item.auth}
                        </span>
                      </div>
                    ) : (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex justify-between items-center px-2 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition"
                      >
                        <span className="font-montserrat text-xs text-blue-700">
                          {item.path}
                        </span>
                        <span className="text-[11px] text-black/50">
                          {item.nombre} · {item.auth}
                        </span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────── BACKEND ─────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold uppercase text-black/60 mb-3">
            Backend
          </h2>
          <div className="space-y-4">
            {rutasBackend.map((grupo) => (
              <div key={grupo.seccion} className="border rounded-xl p-3">
                <h3 className="text-xs font-semibold uppercase text-black/40 mb-2">
                  {grupo.seccion}
                </h3>
                <div className="space-y-1">
                  {grupo.items.map((item) => (
                    <div
                      key={`${item.metodo}-${item.path}`}
                      className={`flex justify-between items-center px-2 py-1.5 rounded-lg text-sm ${
                        item.advertencia ? "bg-red-50" : ""
                      }`}
                    >
                      <span className="font-montserrat text-xs">
                        <span className="font-semibold text-black/70">
                          {item.metodo}
                        </span>{" "}
                        {item.path}
                      </span>
                      <span
                        className={`text-[11px] ${
                          item.advertencia
                            ? "text-red-600 font-medium"
                            : "text-black/50"
                        }`}
                      >
                        {item.advertencia || item.auth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRutasPage;
