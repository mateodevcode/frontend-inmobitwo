// src/pages/organizacion/SolicitarDominioForm.jsx
import { useState } from "react";
import { toast } from "sonner";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

// organizacion: objeto de la organización (con id, custom_domain, dominio_estado)
// onUpdated: callback opcional para refrescar el estado en el componente padre
const SolicitarDominioForm = ({ organizacion, onUpdated }) => {
  const { solicitarDominioPropio } = useOrganizaciones();
  const [dominio, setDominio] = useState(organizacion?.custom_domain || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dominio.trim()) {
      toast.error("Escribe el dominio", { position: "bottom-right" });
      return;
    }

    setLoading(true);
    const res = await solicitarDominioPropio(
      organizacion.id,
      dominio.trim().toLowerCase(),
    );
    setLoading(false);

    if (res.success) {
      toast.success(res.message, { position: "bottom-right" });
      onUpdated?.(res.data);
    } else {
      toast.error(res.error || res.message, { position: "bottom-right" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <label className="block text-sm font-medium">Dominio propio</label>
      <input
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        placeholder="www.tudominio.com"
        className="w-full border rounded-lg px-3 py-2"
      />
      <p className="text-xs text-gray-400">
        Antes de enviarlo, configura en tu proveedor de DNS un registro{" "}
        <strong>CNAME</strong> de <code>{dominio || "www.tudominio.com"}</code>{" "}
        apuntando a nuestro servidor. Te confirmaremos el destino exacto por
        email una vez recibamos tu solicitud.
      </p>
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Solicitar dominio propio"}
      </button>

      {organizacion?.custom_domain && (
        <p className="text-sm mt-2">
          Estado actual: <strong>{organizacion.dominio_estado}</strong>
        </p>
      )}
    </form>
  );
};

export default SolicitarDominioForm;
