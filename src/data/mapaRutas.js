// src/data/mapaRutas.js
// ────────────────────────────────────────────────────────────────
// Fuente única de verdad para el panel /admin/rutas.
// Cuando agregues una ruta nueva al AppRouter o a un .routes.js,
// agregala también acá para que aparezca en el mapa.
// ────────────────────────────────────────────────────────────────

// Rutas del FRONTEND — clickeables, navegan de verdad.
// "param: true" = la ruta necesita un id/slug real, así que se
// muestra como texto informativo en vez de link (no hay a dónde
// navegar sin un dato concreto).
export const rutasFrontend = [
  {
    seccion: "General",
    items: [
      { path: "/", nombre: "Feed", auth: "privada" },
      {
        path: "/lista-propiedades",
        nombre: "Lista de propiedades (prueba)",
        auth: "pública",
      },
      {
        path: "/propiedades/:id",
        nombre: "Detalle de propiedad",
        auth: "privada",
        param: true,
      },
      { path: "/leads", nombre: "Leads", auth: "privada" },
      { path: "/logs", nombre: "Logs", auth: "privada" },
    ],
  },
  {
    seccion: "Autenticación",
    items: [
      { path: "/login", nombre: "Login", auth: "solo si NO logueado" },
      { path: "/registro", nombre: "Registro", auth: "solo si NO logueado" },
    ],
  },
  {
    seccion: "Publicar anuncio",
    items: [
      {
        path: "/info/publicar-anuncio",
        nombre: "Info previa",
        auth: "privada",
      },
      {
        path: "/info/publicar-anuncio/publicar",
        nombre: "Wizard de publicación",
        auth: "privada",
      },
    ],
  },
  {
    seccion: "Usuario",
    items: [
      { path: "/usuario/favoritos", nombre: "Mis favoritos", auth: "privada" },
      {
        path: "/usuario/mis-anuncios",
        nombre: "Mis anuncios",
        auth: "privada",
      },
      {
        path: "/usuario/mis-anuncios/anuncio/:id",
        nombre: "Detalle de mi anuncio",
        auth: "privada",
        param: true,
      },
      {
        path: "/usuario/tus-datos/perfil",
        nombre: "Editar perfil",
        auth: "privada",
      },
      {
        path: "/usuario/tus-datos/acceso",
        nombre: "Seguridad y acceso",
        auth: "privada",
      },
    ],
  },
  {
    seccion: "Organizaciones",
    items: [
      {
        path: "/inmobiliarias/:slug",
        nombre: "Escaparate público",
        auth: "pública",
        param: true,
      },
      {
        path: "/inmobiliarias/nueva",
        nombre: "Crear organización",
        auth: "privada",
      },
      {
        path: "/organizaciones/agentes",
        nombre: "Panel de agentes",
        auth: "privada",
      },
      {
        path: "/organizaciones/ajustes",
        nombre: "Ajustes de mi inmobiliaria",
        auth: "privada",
      },
      {
        path: "/organizaciones/estadisticas/:id",
        nombre: "Estadísticas",
        auth: "privada",
        param: true,
      },
    ],
  },
  {
    seccion: "Superadmin",
    items: [
      { path: "/admin", nombre: "Panel admin general", auth: "superadmin" },
      {
        path: "/admin/organizaciones",
        nombre: "Aprobar / suspender / dominios",
        auth: "superadmin",
      },
      {
        path: "/admin/rutas",
        nombre: "Mapa de rutas (esta página)",
        auth: "superadmin",
      },
    ],
  },
];

// Rutas del BACKEND — solo informativas, nunca clickeables.
export const rutasBackend = [
  {
    seccion: "Auth",
    items: [
      { metodo: "POST", path: "/auth/registro", auth: "pública (rate limit)" },
      { metodo: "POST", path: "/auth/login", auth: "pública (rate limit)" },
      { metodo: "POST", path: "/auth/refresh", auth: "pública (usa cookie)" },
      { metodo: "POST", path: "/auth/logout", auth: "pública (usa cookie)" },
      { metodo: "GET", path: "/auth/me", auth: "token" },
    ],
  },
  {
    seccion: "Usuarios",
    items: [
      { metodo: "GET", path: "/usuarios", auth: "token" },
      { metodo: "GET", path: "/usuarios/:id", auth: "token" },
      { metodo: "POST", path: "/usuarios", auth: "token" },
      { metodo: "PATCH", path: "/usuarios/:id", auth: "token" },
      { metodo: "PATCH", path: "/usuarios/:id/password", auth: "token" },
      { metodo: "DELETE", path: "/usuarios/:id", auth: "token" },
      { metodo: "POST", path: "/usuarios/:id/enviar-codigo", auth: "token" },
      { metodo: "POST", path: "/usuarios/:id/confirmar-codigo", auth: "token" },
      {
        metodo: "PATCH",
        path: "/usuarios/:id/desactivar-verificacion",
        auth: "token",
      },
    ],
  },
  {
    seccion: "Propiedades",
    items: [
      { metodo: "GET", path: "/propiedades", auth: "pública" },
      { metodo: "GET", path: "/propiedades/inicio", auth: "pública" },
      { metodo: "GET", path: "/propiedades/mis-anuncios", auth: "pública ⚠️" },
      {
        metodo: "GET",
        path: "/propiedades/organizacion/:slug",
        auth: "pública",
      },
      { metodo: "GET", path: "/propiedades/:id", auth: "pública" },
      { metodo: "POST", path: "/propiedades", auth: "token" },
      { metodo: "PATCH", path: "/propiedades/:id", auth: "token" },
      { metodo: "DELETE", path: "/propiedades/:id", auth: "token" },
      { metodo: "POST", path: "/publicar-anuncios", auth: "token" },
    ],
  },
  {
    seccion: "Favoritos",
    items: [
      {
        metodo: "POST",
        path: "/favoritos/toggle",
        auth: "token",
        // advertencia: "no montada en index.js",
      },
      {
        metodo: "GET",
        path: "/favoritos/mis-favoritos",
        auth: "token",
        // advertencia: "no montada en index.js",
      },
    ],
  },
  {
    seccion: "Organizaciones",
    items: [
      { metodo: "GET", path: "/organizaciones/publicas", auth: "pública" },
      { metodo: "GET", path: "/organizaciones/slug/:slug", auth: "pública" },
      {
        metodo: "GET",
        path: "/organizaciones/resolve-tenant",
        auth: "pública",
      },
      { metodo: "GET", path: "/organizaciones/mias", auth: "token" },
      { metodo: "GET", path: "/organizaciones", auth: "superadmin" },
      { metodo: "GET", path: "/organizaciones/:id", auth: "pública ⚠️" },
      { metodo: "POST", path: "/organizaciones", auth: "token" },
      { metodo: "PATCH", path: "/organizaciones/:id", auth: "admin de la org" },
      { metodo: "DELETE", path: "/organizaciones/:id", auth: "superadmin" },
      {
        metodo: "GET",
        path: "/organizaciones/:id/estadisticas",
        auth: "miembro de la org",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/aprobar",
        auth: "superadmin",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/suspender",
        auth: "superadmin",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/dominio",
        auth: "admin de la org",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/dominio/activar",
        auth: "superadmin",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/dominio/desactivar",
        auth: "superadmin",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/:id/dominio/quitar",
        auth: "superadmin",
      },
    ],
  },
  {
    seccion: "Organización — Miembros (agentes)",
    items: [
      {
        metodo: "GET",
        path: "/organizaciones/:organizacionId/miembros",
        auth: "miembro de la org",
      },
      {
        metodo: "POST",
        path: "/organizaciones/:organizacionId/miembros",
        auth: "admin de la org",
      },
      {
        metodo: "PATCH",
        path: "/organizaciones/miembros/:id",
        auth: "token (valida dentro)",
      },
      {
        metodo: "DELETE",
        path: "/organizaciones/miembros/:id",
        auth: "token (valida dentro)",
      },
    ],
  },
  {
    seccion: "Tracking / Leads",
    items: [
      { metodo: "POST", path: "/tracking/sesion", auth: "token opcional" },
      { metodo: "POST", path: "/tracking/evento", auth: "token opcional" },
      { metodo: "POST", path: "/tracking/lead", auth: "pública" },
      { metodo: "GET", path: "/tracking/logs", auth: "token" },
      {
        metodo: "PATCH",
        path: "/tracking/lead/:id/contacto",
        auth: "pública ⚠️",
      },
      { metodo: "GET", path: "/leads", auth: "token" },
      { metodo: "PATCH", path: "/leads/:id", auth: "token" },
    ],
  },
  {
    seccion: "Geografía",
    items: [
      { metodo: "GET", path: "/api/countries", auth: "pública" },
      { metodo: "GET", path: "/api/states", auth: "pública" },
      { metodo: "GET", path: "/api/cities", auth: "pública" },
      { metodo: "GET", path: "/api/geocode", auth: "pública" },
    ],
  },
];
