// src/pages/organizacion/MiInmobiliariaPanel.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";
import SolicitarDominioForm from "@/pages/organizacion/SolicitarDominioForm.jsx";
import TemaSelector from "@/pages/organizacion/TemaSelector.jsx";

// ────────────────────────────────────────────────────────────────
// Muestra y permite editar los datos de la organización activa
// (organizaciones[0] — la primera donde el usuario es miembro).
// Si más adelante soportas varias organizaciones por usuario a la vez,
// aquí es donde habría que agregar un selector.
// ────────────────────────────────────────────────────────────────
const MiInmobiliariaPanel = () => {
  const { organizaciones, setOrganizaciones } = useAppContext();
  const { actualizarOrganizacion, cargarMisOrganizaciones } = useOrganizaciones();

  const organizacion = organizaciones[0];

  useEffect(() => {
    cargarMisOrganizaciones();
  }, []);

  const [formData, setFormData] = useState({
    nombre: organizacion?.nombre || "",
    email: organizacion?.email || "",
    telefono: organizacion?.telefono || "",
    website: organizacion?.website || "",
    descripcion: organizacion?.descripcion || "",
    ciudad: organizacion?.ciudad || "",
    provincia: organizacion?.provincia || "",
  });
  const [loading, setLoading] = useState(false);

  if (!organizacion) return null;

  const esAdmin = organizacion.rol_en_org === "agency_admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarOrganizacionEnContexto = (nuevaData) => {
    setOrganizaciones((prev) =>
      prev.map((org) =>
        org.id === organizacion.id ? { ...org, ...nuevaData } : org,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await actualizarOrganizacion(organizacion.id, formData);
    setLoading(false);

    if (res.success) {
      toast.success(res.message, { position: "bottom-right" });
      actualizarOrganizacionEnContexto(res.data);
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-1">Mi inmobiliaria</h2>
        <p className="text-sm text-black/50">
          Estado:{" "}
          <span className="font-medium capitalize">{organizacion.estado}</span>
          {" · "}
          Tu rol:{" "}
          <span className="font-medium">
            {esAdmin ? "Administrador" : "Agente"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          disabled={!esAdmin}
          className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email de contacto"
          disabled={!esAdmin}
          className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
        />
        <input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          disabled={!esAdmin}
          className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
        />
        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Sitio web"
          disabled={!esAdmin}
          className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
            disabled={!esAdmin}
            className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
          />
          <input
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            placeholder="Provincia"
            disabled={!esAdmin}
            className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
          />
        </div>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          rows={3}
          disabled={!esAdmin}
          className="w-full border rounded-lg px-3 py-2 disabled:bg-stone-100"
        />

        {esAdmin && (
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </form>

      {esAdmin && (
        <div className="border-t pt-6">
          <TemaSelector
            organizacion={organizacion}
            onCambiado={actualizarOrganizacionEnContexto}
          />
        </div>
      )}

      {esAdmin && (
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">Dominio propio</h3>
          <SolicitarDominioForm
            organizacion={organizacion}
            onUpdated={actualizarOrganizacionEnContexto}
          />
        </div>
      )}
    </div>
  );
};

export default MiInmobiliariaPanel;
