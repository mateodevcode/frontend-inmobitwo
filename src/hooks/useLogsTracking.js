// src/hooks/useLogsTracking.js
import { apiBackend } from "@/api/apiBackend.js";
import { useAppContext } from "@/context/AppContext.js";

const useLogsTracking = () => {
  const { setLogsTracking, setLoadingLogsTracking } = useAppContext();

  const cargarLogsTracking = async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) setLoadingLogsTracking(true);

      const data = await apiBackend("/tracking/logs?limit=150");

      if (data.success) {
        setLogsTracking(data.data || []);
      }
    } catch (error) {
      console.error("❌ Error cargando logs de tracking:", error);
    } finally {
      if (mostrarLoading) setLoadingLogsTracking(false);
    }
  };

  return { cargarLogsTracking };
};

export default useLogsTracking;
