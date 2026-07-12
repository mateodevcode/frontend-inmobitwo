// src/hooks/useOrganizaciones.js
import { toast } from "sonner";
import { apiBackend } from "@/api/apiBackend.js";
import { useAppContext } from "@/context/AppContext.js";

const useOrganizaciones = () => {
  const { iniciarCarga, terminarCarga } = useAppContext();

  // ─────────────────────────────────────────────
  // Crear organización (queda 'pendiente' de aprobación)
  // ─────────────────────────────────────────────
  const crearOrganizacion = async (
    e,
    formData,
    usuarioId,
    setLoading,
    onSuccess,
  ) => {
    e.preventDefault();

    if (!formData.nombre) {
      toast.error("El nombre es requerido", { position: "bottom-right" });
      return;
    }
    if (!usuarioId) {
      toast.error("Debes iniciar sesión para crear una organización", {
        position: "bottom-right",
      });
      return;
    }

    try {
      iniciarCarga();
      setLoading?.(true);

      const payload = { ...formData, creada_por_id: usuarioId };
      const res = await apiBackend("/organizaciones", "POST", payload);

      if (res.success) {
        toast.success(res.message, { position: "bottom-right" });
        onSuccess?.(res.data);
      } else {
        console.warn("⚠️ Error:", res.error);
        toast.error(res.error || res.message, { position: "bottom-right" });
      }

      return res;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error creando la organización", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading?.(false);
    }
  };

  // ─────────────────────────────────────────────
  // "Mi organización" — para el sidebar / dashboard del agency_admin
  // Trae todas las organizaciones donde el usuario logueado es miembro activo.
  // ─────────────────────────────────────────────
  const cargarMisOrganizaciones = async () => {
    return apiBackend("/organizaciones/mias");
  };

  // ─────────────────────────────────────────────
  // Consultar organización por slug (para /inmobiliarias/:slug)
  // ─────────────────────────────────────────────
  const cargarOrganizacionPorSlug = async (slug) => {
    return apiBackend(`/organizaciones/slug/${slug}`);
  };

  // ─────────────────────────────────────────────
  // Editar datos de perfil de la organización (solo agency_admin de esa org)
  // ─────────────────────────────────────────────
  const actualizarOrganizacion = async (organizacionId, data) => {
    return apiBackend(`/organizaciones/${organizacionId}`, "PATCH", data);
  };

  // ─────────────────────────────────────────────
  // Listar propiedades de una organización, paginado por cursor
  // ─────────────────────────────────────────────
  const cargarPropiedadesOrganizacion = async (
    slug,
    cursor = null,
    limit = 10,
  ) => {
    const url = cursor
      ? `/propiedades/organizacion/${slug}?limit=${limit}&cursor=${encodeURIComponent(cursor)}`
      : `/propiedades/organizacion/${slug}?limit=${limit}`;

    return apiBackend(url);
  };

  // ─────────────────────────────────────────────
  // Solicitar dominio propio (lo hace el agency_admin de la organización)
  // ─────────────────────────────────────────────
  const solicitarDominioPropio = async (organizacionId, customDomain) => {
    return apiBackend(`/organizaciones/${organizacionId}/dominio`, "PATCH", {
      custom_domain: customDomain,
    });
  };

  // ─────────────────────────────────────────────
  // AGENTES — gestión de organizacion_miembros
  // ─────────────────────────────────────────────
  const cargarMiembros = async (organizacionId) => {
    return apiBackend(`/organizaciones/${organizacionId}/miembros`);
  };

  const crearMiembroOrganizacion = async (
    organizacionId,
    email,
    rolEnOrg = "agent",
  ) => {
    return apiBackend(`/organizaciones/${organizacionId}/miembros`, "POST", {
      email,
      rol_en_org: rolEnOrg,
    });
  };

  const actualizarMiembroOrganizacion = async (miembroId, data) => {
    return apiBackend(`/organizaciones/miembros/${miembroId}`, "PATCH", data);
  };

  const eliminarMiembroOrganizacion = async (miembroId) => {
    return apiBackend(`/organizaciones/miembros/${miembroId}`, "DELETE");
  };

  const cargarEstadisticasOrganizacion = async (organizacionId) => {
    return apiBackend(`/organizaciones/${organizacionId}/estadisticas`);
  };

  // ─────────────────────────────────────────────
  // SUPERADMIN — listado completo (filtrable por estado)
  // ─────────────────────────────────────────────
  const cargarOrganizacionesAdmin = async (estado = null) => {
    const url = estado ? `/organizaciones?estado=${estado}` : "/organizaciones";
    return apiBackend(url);
  };

  const aprobarOrganizacion = async (id) =>
    apiBackend(`/organizaciones/${id}/aprobar`, "PATCH");

  const suspenderOrganizacion = async (id) =>
    apiBackend(`/organizaciones/${id}/suspender`, "PATCH");

  const activarDominioPropio = async (id) =>
    apiBackend(`/organizaciones/${id}/dominio/activar`, "PATCH");

  return {
    crearOrganizacion,
    cargarMisOrganizaciones,
    cargarOrganizacionPorSlug,
    actualizarOrganizacion,
    cargarPropiedadesOrganizacion,
    solicitarDominioPropio,
    cargarEstadisticasOrganizacion,

    // agentes
    cargarMiembros,
    crearMiembroOrganizacion,
    actualizarMiembroOrganizacion,
    eliminarMiembroOrganizacion,

    // superadmin
    cargarOrganizacionesAdmin,
    aprobarOrganizacion,
    suspenderOrganizacion,
    activarDominioPropio,
  };
};

export default useOrganizaciones;
