// src/hooks/useLeads.js
import { toast } from "sonner";
import { apiBackend } from "@/api/apiBackend.js";
import { useAppContext } from "@/context/AppContext.js";

const useLeads = () => {
  const { iniciarCarga, terminarCarga, setLeads, setLoadingLeads } =
    useAppContext();

  const cargarLeads = async () => {
    try {
      iniciarCarga();
      setLoadingLeads(true);

      const data = await apiBackend("/leads");

      if (data.success) {
        setLeads(data.data || []);
      } else {
        toast.error(data.error || "No se pudieron cargar los leads", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("❌ Error cargando leads:", error);
      toast.error("Error de conexión", { position: "bottom-right" });
    } finally {
      terminarCarga();
      setLoadingLeads(false);
    }
  };

  const actualizarEstadoLead = async (leadId, nuevoEstado, leadsActuales) => {
    try {
      iniciarCarga();
      const data = await apiBackend(`/leads/${leadId}`, "PATCH", {
        estado: nuevoEstado,
      });

      if (data.success) {
        // Actualiza el lead en el estado local sin recargar todo
        const actualizados = leadsActuales.map((lead) =>
          lead.id === leadId ? { ...lead, estado: nuevoEstado } : lead,
        );
        setLeads(actualizados);
        toast.success("Estado actualizado", { position: "bottom-right" });
      } else {
        toast.error(data.error || "No se pudo actualizar el estado", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("❌ Error actualizando lead:", error);
      toast.error("Error de conexión", { position: "bottom-right" });
    } finally {
      terminarCarga();
    }
  };

  return { cargarLeads, actualizarEstadoLead };
};

export default useLeads;
