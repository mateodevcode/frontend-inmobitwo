// hooks/useResetForm.js

import { useAppContext } from "@/context/AppContext";
import { apiBackend } from "@/api/apiBackend.js";
import { toast } from "sonner";

const useOrganizaciones = () => {
  const { setOrganizaciones, cargandoGlobal, iniciarCarga, terminarCarga } =
    useAppContext();

  // --------------------------------
  // cargar organizaciones de home
  // --------------------------------
  const cargarOrganizaciones = async () => {
    if (cargandoGlobal) return; // evita pedir doble o pedir cuando ya no hay más
    iniciarCarga();

    try {
      const url = "/organizaciones";

      const res = await apiBackend(url);

      if (res.success) {
        setOrganizaciones(res.data);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      terminarCarga();
    }
  };

  //   const cargarOrganizaciones = async () => {
  //     try {
  //       setLoadingOrganizaciones(true);
  //       const res = await apiBackend("/organizaciones");

  //       if (res.success) {
  //         setOrganizaciones(res.data || []);
  //       } else {
  //         toast.error("No se pudo cargar las organizaciones", {
  //           description: res.error || "Error desconocido",
  //           position: "bottom-right",
  //         });
  //       }
  //     } catch (error) {
  //       toast.error("Error de conexión", {
  //         description: "No se pudo conectar con el servidor",
  //         position: "bottom-right",
  //       });
  //     } finally {
  //       setLoadingOrganizaciones(false);
  //     }
  //   };

  return {
    cargarOrganizaciones,
  };
};
export default useOrganizaciones;
