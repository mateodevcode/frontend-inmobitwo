# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint on all JS/JSX files
```

No test suite is configured yet.

## Tech Stack

- **React 19** + **Vite 8** (plain JS/JSX, no TypeScript)
- **Tailwind CSS 4** with custom fonts (Montserrat, Poppins)
- **react-router-dom v7** for routing
- **sonner** for toast notifications
- **motion** (Framer Motion) for animations
- **lucide-react** + **react-icons** for icons
- **@headlessui/react** for accessible UI primitives
- **Leaflet** + **react-leaflet** for maps

## Architecture

### Path alias

`@/` maps to `src/` (configured in `vite.config.mjs`).

### Routing ([src/router/AppRouter.jsx](src/router/AppRouter.jsx))

Three route wrapper components enforce auth:

- **`RutaPrivada`** — redirects to `/login` if not authenticated
- **`RutaAdmin`** — requires `superadmin` role, otherwise redirects to `/dashboard`
- **`RutaPublica`** — redirects to `/` if already authenticated (for login/register pages)

Auth state comes from `useAppContext().estaAutenticado`.

### State management ([src/context/AppProvider.jsx](src/context/AppProvider.jsx))

Single `AppContext` (React Context) holds all global state:

- **Auth**: `usuario`, `estaAutenticado`, `esSuperAdmin`, `guardarSesion()`, `cerrarSesion()`
- **Properties**: `propiedades[]`, `propiedad`, `formDataPropiedad`, CRUD state
- **Organizations**: `organizaciones[]`
- **Modals**: boolean flags for `openModalUser`, `openModalAgregarPropiedad`, `openModalConfirmarEliminarPropiedad`, `openModalHamburguesa`, `openModalCambiarPassword`
- **Publishing wizard**: `contentNumber` (current step 0-2), `comprobarDireccion`, `confirmedLocation`
- **Global loader**: `cargandoGlobal`, `iniciarCarga()`, `terminarCarga()` — ref-counted so overlapping requests don't flicker the overlay

Access via `useAppContext()` from [src/context/AppContext.js](src/context/AppContext.js).

### API layer ([src/api/](src/api/))

| Module | Purpose | Auth method |
|---|---|---|
| `apiBackend.js` | JSON requests | JWT access token in `Authorization` header, auto-refreshes via cookie on 401 |
| `apiBackendFormData.js` | Multipart file uploads | Same JWT + refresh pattern |

All return a normalized shape: `{ success, message, data, error, status }`.

**Token refresh flow**: When a 401 is received and a token exists, both `apiBackend` and `apiBackendFormData` call `POST /auth/refresh` (with `credentials: "include"` to send the httpOnly refresh cookie), store the new access token in `localStorage`, and retry the original request once. On failure, they clear storage and redirect to `/login`.

### Auth flow

- Login: `POST /auth/login` → stores `usuario` + `accessToken` in localStorage
- Register: `POST /auth/registro` → auto-logs in
- Logout: `POST /auth/logout` → clears localStorage
- Session is restored on page load from localStorage (see `AppProvider` constructor)

### Custom hooks ([src/hooks/](src/hooks/))

- **`useAuth`** — login, register, logout handlers; form state management for auth forms
- **`usePropiedades`** — CRUD for properties (create with images, publish announcement, update, delete, photo upload)
- **`useUsuarios`** — user profile updates, password change, email verification (send/confirm/disable 2FA codes)
- **`useGeo`** — generic hook that fetches from backend endpoints, used for cascading country→state→city selects. Accepts `null` endpoint to skip fetching
- **`useResetForm`** — resets `formDataPropiedad` and `formDataUsuario` to initial values
- **`useTypingPlaceholder`** — animated typewriter effect for search placeholder
- **`useTiempoRelativo`** — relative time formatting (e.g., "Hace 3 h")

### Page layout

- **Home** (`/`): Three-column layout — `Sidebar` (left, fixed 384px) + `Principal` (feed, center) + `Actividad` (right)
- **Publishing wizard** (`/info/publicar-anuncio/publicar`): 3-step wizard controlled by `contentNumber` — 0=DatosBásicos, 1=Detalles, 2=Fotos. Uses `localStorage` to persist incomplete drafts across sessions
- **User profile**: `/usuario/tus-datos/perfil` and `/usuario/tus-datos/acceso`
- **Mis anuncios**: `/usuario/mis-anuncios` and `/usuario/mis-anuncios/anuncio/:id`

### Global loader

[LoaderGlobal.jsx](src/components/loader/LoaderGlobal.jsx) renders a full-screen translucent overlay with spinner. It's driven by a ref-counter (`contadorPeticiones`) in AppProvider — call `iniciarCarga()` before any async work and `terminarCarga()` in finally. The overlay only hides when the counter reaches 0, preventing flicker during overlapping requests.

### Publishing wizard draft recovery

When a user publishes step 1 (DatosBasicos), the newly created property ID is saved to `localStorage` key `"ultimoAnuncioId"`. On revisiting the publish page without an `?id=` param, a modal offers to resume or start fresh. The ID is cleared when photos are uploaded or skipped in step 3.

### Data files ([src/data/](src/data/))

Static configuration for the UI: sidebar menu items, property types, operation/rental type options, Colombia departments/cities, filter labels, placeholder phrases, and scrollbar styles.

### Environment

Backend URL is read from `VITE_API_URL` env var, defaulting to `http://localhost:3001`. The `.env` file also contains AWS S3 credentials and database config for the backend (this frontend does not use them directly — they're documented here for reference but should never be committed).
