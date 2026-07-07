// src/context/AppProvider.jsx
import { useCallback, useRef, useState } from "react";
import { AppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { getSessionId } from "@/utils/getSessionId.js";

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

    // Re-enviamos /tracking/sesion ahora que el token ya está en localStorage,
    // para que verificarTokenOpcional decodifique req.usuario y el backend
    // actualice sesiones_tracking.usuario_id (vía el ON CONFLICT ... COALESCE
    // que ya tiene registrarSesion).
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
  const formDataUsuarioInicial = {
    name: "",
    email: "",
    password: "",
    telefono: "",
    rol: "user",
    image_url: null,
    public_id: null,
    email_verificado: false,
  };

  const [formDataUsuario, setFormDataUsuario] = useState({
    name: "",
    email: "",
    password: "",
    telefono: "",
    rol: "user",
    image_url: null,
    public_id: null,
    email_verificado: false,
  });

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

  const [formDataPropiedad, setFormDataPropiedad] = useState({
    tipo: "",
    operacion: "venta",
    country_id: 0,
    state_id: 0,
    city_id: 0,
    direccion: "",
    numero_direccion: "",
    latitude: 0,
    longitude: 0,
    titulo: "",
    imagen_principal_url: "",
    imagen_principal_public_id: "",
    estado: "publicado",
    es_de_organizacion: false,
    organizacion_id: "null",
    publicado_por_id: "",
    galeria: [
      {
        url: "",
        publicId: "",
      },
    ],
  });

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [logsTracking, setLogsTracking] = useState([]);
  const [loadingLogsTracking, setLoadingLogsTracking] = useState(false);
  const [openModalContactoLead, setOpenModalContactoLead] = useState(false);
  const [leadPendienteContacto, setLeadPendienteContacto] = useState(null);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
