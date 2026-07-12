// src/config/tenantConfig.js
// ────────────────────────────────────────────────────────────────
// Dominios que consideramos "la plataforma principal" (red social).
// Cualquier otro hostname que llegue por window.location.host se
// trata como un posible dominio propio de una organización, y se
// intenta resolver contra el backend.
//
// Configúralo en tu .env del frontend:
//   VITE_MAIN_HOSTS=barbershopbbg.com,www.barbershopbbg.com,localhost:5173
//
// (incluye el puerto en local, ej: localhost:5173, porque
// window.location.host lo incluye si no es 80/443)
// ────────────────────────────────────────────────────────────────
export const MAIN_HOSTS = (import.meta.env.VITE_MAIN_HOSTS || "localhost:5173")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);
