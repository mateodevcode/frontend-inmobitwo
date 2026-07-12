// src/pages/admin/AdminOrganizacionesPage.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

const ESTADOS = ["pendiente", "aprobada", "suspendida"];

const AdminOrganizacionesPage = () => {
  const {
    cargarOrganizacionesAdmin,
    aprobarOrganizacion,
    suspenderOrganizacion,
    activarDominioPropio,
    desactivarDominioPropio,
    quitarDominioPropio,
  } = useOrganizaciones();

  const [organizaciones, setOrganizaciones] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const res = await cargarOrganizacionesAdmin(filtro || null);
    if (res.success) setOrganizaciones(res.data);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const ejecutarAccion = async (accion, id, mensajeOk) => {
    const res = await accion(id);
    if (res.success) {
      toast.success(mensajeOk || res.message, { position: "bottom-right" });
      cargar();
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Organizaciones</h1>

      <div className="flex gap-2 mb-4">
        {ESTADOS.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              filtro === estado ? "bg-black text-white" : "bg-white"
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : organizaciones.length === 0 ? (
        <p className="text-gray-400">No hay organizaciones en este estado.</p>
      ) : (
        <div className="space-y-3">
          {organizaciones.map((org) => (
            <div
              key={org.id}
              className="border rounded-xl p-4 flex justify-between items-center gap-4"
            >
              <div>
                <p className="font-semibold">{org.nombre}</p>
                <p className="text-xs text-gray-400">
                  /inmobiliarias/{org.slug}
                </p>
                {org.custom_domain && (
                  <p className="text-xs text-gray-400">
                    Dominio: {org.custom_domain} ({org.dominio_estado})
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                {org.estado !== "aprobada" && (
                  <button
                    onClick={() =>
                      ejecutarAccion(
                        aprobarOrganizacion,
                        org.id,
                        "Organización aprobada",
                      )
                    }
                    className="text-sm px-3 py-1 rounded-lg bg-green-600 text-white"
                  >
                    Aprobar
                  </button>
                )}
                {org.estado !== "suspendida" && (
                  <button
                    onClick={() =>
                      ejecutarAccion(
                        suspenderOrganizacion,
                        org.id,
                        "Organización suspendida",
                      )
                    }
                    className="text-sm px-3 py-1 rounded-lg bg-red-600 text-white"
                  >
                    Suspender
                  </button>
                )}

                {/* Dominio pendiente de verificación DNS: activar o cancelar la solicitud */}
                {org.custom_domain &&
                  org.dominio_estado === "pendiente_dns" && (
                    <>
                      <button
                        onClick={() =>
                          ejecutarAccion(
                            activarDominioPropio,
                            org.id,
                            "Dominio activado",
                          )
                        }
                        className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white"
                      >
                        Activar dominio
                      </button>
                      <button
                        onClick={() =>
                          ejecutarAccion(
                            quitarDominioPropio,
                            org.id,
                            "Solicitud de dominio cancelada",
                          )
                        }
                        className="text-sm px-3 py-1 rounded-lg bg-gray-500 text-white"
                      >
                        Cancelar solicitud
                      </button>
                    </>
                  )}

                {/* Dominio activo: pausar (mantiene el dato) o quitar (lo elimina) */}
                {org.custom_domain && org.dominio_estado === "activo" && (
                  <>
                    <button
                      onClick={() =>
                        ejecutarAccion(
                          desactivarDominioPropio,
                          org.id,
                          "Dominio desactivado (pausado)",
                        )
                      }
                      className="text-sm px-3 py-1 rounded-lg bg-yellow-600 text-white"
                    >
                      Pausar dominio
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar el dominio propio de "${org.nombre}"? Asegurate de haber corrido antes quitar-dominio.sh en el servidor.`,
                          )
                        ) {
                          ejecutarAccion(
                            quitarDominioPropio,
                            org.id,
                            "Dominio eliminado",
                          );
                        }
                      }}
                      className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
                    >
                      Quitar dominio
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrganizacionesPage;
