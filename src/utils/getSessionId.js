// src/utils/getSessionId.js
const SESSION_KEY = "tracking_session_id";

// Genera un UUID v4 manualmente, sin depender de crypto.randomUUID()
// (necesario para contextos no seguros: IPs locales, HTTP sin TLS, etc.)
const generarUUIDFallback = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generarSessionId = () => {
  // Usa la API nativa si está disponible (más segura, contextos HTTPS/localhost)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback para contextos no seguros (HTTP con IP, etc.)
  return generarUUIDFallback();
};

export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generarSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};
