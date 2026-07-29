// src/context/AppProvider.jsx
import { useCallback, useRef, useState } from "react";
import { AppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { getSessionId } from "@/utils/getSessionId.js";
import {
  FORM_DATA_PROPIEDAD_INICIAL,
  FORM_DATA_USUARIO_INICIAL,
} from "@/hooks/useResetForm";

export const AppProvider = ({ children }) => {
  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────
  const [usuario, setUsuario] = useState(() => {
    // Recuperar usuario del localStorage al cargar la app
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const guardarSesion = async (usuarioData, accessToken) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    localStorage.setItem("access_token", accessToken);
    setUsuario(usuarioData);

    if (consentimientoTracking === true) {
      try {
        const session_id = getSessionId();
        await apiBackend("/tracking/sesion", "POST", {
          session_id,
          consentimiento_dado: true,
        });
      } catch (error) {
        console.error(
          "❌ Error actualizando sesión de tracking post-login:",
          error,
        );
      }
    }
  };

  const cerrarSesion = async () => {
    await apiBackend("/auth/logout", "POST");
    localStorage.removeItem("usuario");
    localStorage.removeItem("access_token");
    setUsuario(null);
    setPropiedades([]);
  };

  const estaAutenticado = !!usuario;
  const esSuperAdmin = usuario?.rol === "superadmin";

  // ─────────────────────────────────────────────
  // FORMULARIO USUARIO (login / registro)
  // ─────────────────────────────────────────────
  const formDataUsuarioInicial = FORM_DATA_USUARIO_INICIAL;

  const [formDataUsuario, setFormDataUsuario] = useState(
    FORM_DATA_USUARIO_INICIAL,
  );

  const resetFormDataUsuario = () => setFormDataUsuario(formDataUsuarioInicial);

  // ─────────────────────────────────────────────
  // PROPIEDADES
  // ─────────────────────────────────────────────
  const [propiedades, setPropiedades] = useState([]);
  const [propiedad, setPropiedad] = useState({});
  const [organizaciones, setOrganizaciones] = useState([]);
  // const [loadingPropiedades, setLoadingPropiedades] = useState(true);
  const [loadingPropiedades, setLoadingPropiedades] = useState(true);
  const [search, setSearch] = useState("");
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalAgregarPropiedad, setOpenModalAgregarPropiedad] =
    useState(false);
  const [
    openModalConfirmarEliminarPropiedad,
    setOpenModalConfirmarEliminarPropiedad,
  ] = useState(false);
  const [propiedadAEliminar, setPropiedadAEliminar] = useState(null);
  const [eliminandoPropiedad, setEliminandoPropiedad] = useState(false);

  const [cargandoGlobal, setCargandoGlobal] = useState(false);
  const contadorPeticiones = useRef(0);
  const [contentNumber, setContentNumber] = useState(0);
  const [comprobarDireccion, setComprobarDireccion] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(null);
  const [openModalHamburguesa, setOpenModalHamburguesa] = useState(false);
  const [openModalCambiarPassword, setOpenModalCambiarPassword] =
    useState(false);
  const [openModalSidebar, setOpenModalSidebar] = useState(false);
  const [openModalActividades, setOpenModalActividades] = useState(false);
  const [openModalUserPropiedadId, setModalUserPropiedadId] = useState(false);

  // Cargar Home
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [formDataPropiedad, setFormDataPropiedad] = useState(
    FORM_DATA_PROPIEDAD_INICIAL,
  );

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [logsTracking, setLogsTracking] = useState([]);
  const [loadingLogsTracking, setLoadingLogsTracking] = useState(false);
  const [openModalContactoLead, setOpenModalContactoLead] = useState(false);
  const [leadPendienteContacto, setLeadPendienteContacto] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todo");

  // Se llama AL INICIO de cualquier petición
  const iniciarCarga = useCallback(() => {
    contadorPeticiones.current += 1;
    setCargandoGlobal(true);
  }, []);

  // Se llama AL FINAL (en el finally) de cualquier petición
  const terminarCarga = useCallback(() => {
    contadorPeticiones.current = Math.max(0, contadorPeticiones.current - 1);
    if (contadorPeticiones.current === 0) {
      setCargandoGlobal(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  // TRACKING / CONSENTIMIENTO RGPD
  // ─────────────────────────────────────────────
  const [consentimientoTracking, setConsentimientoTracking] = useState(() => {
    const guardado = localStorage.getItem("consentimiento_tracking");
    return guardado ? JSON.parse(guardado) : null; // null = aún no ha decidido
  });

  const aceptarTracking = () => {
    localStorage.setItem("consentimiento_tracking", "true");
    setConsentimientoTracking(true);
  };

  const rechazarTracking = () => {
    localStorage.setItem("consentimiento_tracking", "false");
    setConsentimientoTracking(false);
  };

  // ─────────────────────────────────────────────
  // VALOR DEL CONTEXTO
  // ─────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        // Auth
        usuario,
        loadingAuth,
        setLoadingAuth,
        estaAutenticado,
        esSuperAdmin,
        guardarSesion,
        cerrarSesion,

        // Formulario usuario
        formDataUsuario,
        setFormDataUsuario,
        resetFormDataUsuario,

        // Propiedades
        propiedades,
        setPropiedades,
        loadingPropiedades,
        setLoadingPropiedades,
        // refreshPropiedades: cargarPropiedades,
        formDataPropiedad,
        setFormDataPropiedad,
        propiedadAEliminar,
        setPropiedadAEliminar,
        eliminandoPropiedad,
        setEliminandoPropiedad,
        propiedad,
        setPropiedad,

        // Search
        search,
        setSearch,

        // modales
        openModalUser,
        setOpenModalUser,
        openModalAgregarPropiedad,
        setOpenModalAgregarPropiedad,
        openModalConfirmarEliminarPropiedad,
        setOpenModalConfirmarEliminarPropiedad,
        openModalHamburguesa,
        setOpenModalHamburguesa,
        openModalCambiarPassword,
        setOpenModalCambiarPassword,
        openModalSidebar,
        setOpenModalSidebar,
        openModalActividades,
        setOpenModalActividades,
        openModalContactoLead,
        setOpenModalContactoLead,
        openModalUserPropiedadId,
        setModalUserPropiedadId,

        // Organizaciones
        organizaciones,
        setOrganizaciones,

        // Carga global
        cargandoGlobal,
        iniciarCarga,
        terminarCarga,

        // publicar anuncio
        contentNumber,
        setContentNumber,
        comprobarDireccion,
        setComprobarDireccion,
        confirmedLocation,
        setConfirmedLocation,

        // Home
        cursor,
        setCursor,
        hasMore,
        setHasMore,

        // Tracking / consentimiento
        consentimientoTracking,
        aceptarTracking,
        rechazarTracking,

        // Leads
        leads,
        setLeads,
        loadingLeads,
        setLoadingLeads,

        // Logs de tracking
        logsTracking,
        setLogsTracking,
        loadingLogsTracking,
        setLoadingLogsTracking,
        leadPendienteContacto,
        setLeadPendienteContacto,

        // Favoritos
        favoritos,
        setFavoritos,

        // Filtros
        filtroSeleccionado,
        setFiltroSeleccionado,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
