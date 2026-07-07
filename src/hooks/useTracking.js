// src/hooks/useTracking.js
import { useCallback, useRef } from "react";
import { apiBackend } from "@/api/apiBackend.js";
import { useAppContext } from "@/context/AppContext.js";
import { getSessionId } from "@/utils/getSessionId.js";

const useTracking = () => {
  const {
    consentimientoTracking,
    setOpenModalContactoLead,
    setLeadPendienteContacto,
  } = useAppContext();
  const sesionRegistrada = useRef(false); // evita registrar la sesión más de una vez por carga de app

  // ─────────────────────────────────────────────
  // Registra (o actualiza) la sesión de tracking en el backend
  // ─────────────────────────────────────────────
  const registrarSesion = useCallback(async () => {
    if (consentimientoTracking !== true) return;
    if (sesionRegistrada.current) return; // ya se registró en esta instancia del hook
    try {
      const session_id = getSessionId();
      await apiBackend("/tracking/sesion", "POST", {
        session_id,
        consentimiento_dado: true,
      });
      sesionRegistrada.current = true;
    } catch (error) {
      console.error("❌ Error registrando sesión de tracking:", error);
    }
  }, [consentimientoTracking]);

  // ─────────────────────────────────────────────
  // Registra un evento de comportamiento sobre una propiedad.
  // Devuelve la respuesta del backend ({ score, leadCreado }) para que quien
  // llame pueda decidir si necesita reaccionar (ej. mostrar el modal de contacto).
  // ─────────────────────────────────────────────
  const registrarEvento = useCallback(
    async (propiedad_id, tipo_evento, metadata = {}) => {
      if (consentimientoTracking !== true) return null;
      if (!propiedad_id || !tipo_evento) return null;
      try {
        const session_id = getSessionId();
        const data = await apiBackend("/tracking/evento", "POST", {
          session_id,
          propiedad_id,
          tipo_evento,
          metadata,
        });
        return data;
      } catch (error) {
        // No mostramos toast aquí — el tracking es "silencioso",
        // un fallo no debe interrumpir la experiencia del usuario
        console.error("❌ Error registrando evento de tracking:", error);
        return null;
      }
    },
    [consentimientoTracking],
  );

  // ─────────────────────────────────────────────
  // Igual que registrarEvento, pero además revisa la respuesta: si se generó
  // un lead SIN contacto, abre el modal para pedirle los datos al visitante.
  // Usa sessionStorage para no mostrarlo repetidamente por la misma propiedad
  // dentro de la misma pestaña/sesión de navegación.
  // ─────────────────────────────────────────────
  const dispararEventoYRevisar = useCallback(
    async (propiedad_id, tipo_evento, metadata = {}) => {
      const data = await registrarEvento(propiedad_id, tipo_evento, metadata);
      const leadCreado = data?.data?.leadCreado;

      if (!leadCreado) return data;

      const tieneContacto = !!(leadCreado.email || leadCreado.telefono);
      if (tieneContacto) return data;

      const claveModalMostrado = `modal_contacto_mostrado_${propiedad_id}`;
      if (sessionStorage.getItem(claveModalMostrado)) return data;

      sessionStorage.setItem(claveModalMostrado, "true");
      setLeadPendienteContacto({ id: leadCreado.id, propiedad_id });
      setOpenModalContactoLead(true);

      return data;
    },
    [registrarEvento, setLeadPendienteContacto, setOpenModalContactoLead],
  );

  // ─────────────────────────────────────────────
  // El visitante completa sus datos en el ModalContactoLead
  // ─────────────────────────────────────────────
  const actualizarContactoLead = useCallback(
    async (leadId, { nombre, email, telefono }) => {
      try {
        const data = await apiBackend(
          `/tracking/lead/${leadId}/contacto`,
          "PATCH",
          { nombre, email, telefono },
        );
        return data;
      } catch (error) {
        console.error("❌ Error actualizando contacto del lead:", error);
        return { success: false };
      }
    },
    [],
  );

  // ─────────────────────────────────────────────
  // Envía el formulario de contacto → crea un lead directo
  // ─────────────────────────────────────────────
  const enviarFormularioContacto = useCallback(
    async (propiedad_id, { nombre, email, telefono, mensaje }) => {
      try {
        const session_id = getSessionId();
        const data = await apiBackend("/tracking/lead", "POST", {
          propiedad_id,
          session_id,
          nombre,
          email,
          telefono,
          mensaje,
        });
        return data;
      } catch (error) {
        console.error("❌ Error enviando formulario de contacto:", error);
        return { success: false };
      }
    },
    [],
  );

  return {
    registrarSesion,
    registrarEvento,
    dispararEventoYRevisar,
    actualizarContactoLead,
    enviarFormularioContacto,
  };
};

export default useTracking;
