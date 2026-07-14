// src/router/organizacionRoutes.jsx
// ────────────────────────────────────────────────────────────────
// Todas las rutas relacionadas a organizaciones (multi-tenant).
// Para agregar/editar una ruta de organizaciones, este es el
// archivo a tocar — AppRouter.jsx no debería necesitar cambios.
// ────────────────────────────────────────────────────────────────
import { Route, Navigate } from "react-router-dom";
import { RutaPrivada, RutaAdmin } from "@/router/guards.jsx";

import CrearOrganizacionForm from "@/pages/organizacion/CrearOrganizacionForm.jsx";
import AgentesPanel from "@/pages/organizacion/AgentesPanel.jsx";
import MiInmobiliariaPanel from "@/pages/organizacion/MiInmobiliariaPanel.jsx";
import EstadisticasPanel from "@/pages/organizacion/EstadisticasPanel.jsx";
import AdminOrganizacionesPage from "@/pages/admin/AdminOrganizacionesPage.jsx";

import LayoutResolver from "@/pages/organizacion/paginas/LayoutResolver.jsx";
import LayoutPublicoResolver from "@/pages/organizacion/paginas/LayoutPublicoResolver.jsx";
import HomeTemaSlot from "@/pages/organizacion/paginas/HomeTemaSlot.jsx";
import SobreNosotrosTemaSlot from "@/pages/organizacion/paginas/SobreNosotrosTemaSlot.jsx";
import ContactoTemaSlot from "@/pages/organizacion/paginas/ContactoTemaSlot.jsx";

// ────────────────────────────────────────────────────────────────
// MODO ORGANIZACIÓN (dominio propio) — reemplaza TODO el árbol de
// rutas cuando TenantProvider detecta modo === "organizacion".
// ────────────────────────────────────────────────────────────────
export const rutasModoOrganizacion = (
  <>
    <Route path="/" element={<LayoutResolver />}>
      <Route index element={<HomeTemaSlot />} />
      <Route path="sobre-nosotros" element={<SobreNosotrosTemaSlot />} />
      <Route path="contacto" element={<ContactoTemaSlot />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);

// ────────────────────────────────────────────────────────────────
// MODO RED SOCIAL — se insertan dentro del árbol normal de rutas
// (todo lo que antes vivía bajo el comentario "Organizaciones —
// multi-tenant — NUEVO" en AppRouter.jsx).
// ────────────────────────────────────────────────────────────────
export const rutasOrganizacion = (
  <>
    {/* Vitrina pública de una organización, sin dominio propio */}
    <Route path="/inmobiliarias/:slug" element={<LayoutPublicoResolver />}>
      <Route index element={<HomeTemaSlot />} />
      <Route path="sobre-nosotros" element={<SobreNosotrosTemaSlot />} />
      <Route path="contacto" element={<ContactoTemaSlot />} />
    </Route>

    {/* Solicitar creación de una organización — requiere login */}
    <Route
      path="/inmobiliarias/nueva"
      element={
        <RutaPrivada>
          <CrearOrganizacionForm />
        </RutaPrivada>
      }
    />

    {/* Panel de agentes de mi organización */}
    <Route
      path="/organizaciones/agentes"
      element={
        <RutaPrivada>
          <AgentesPanel />
        </RutaPrivada>
      }
    />

    {/* Ajustes de mi organización (datos + dominio propio + tema) */}
    <Route
      path="/organizaciones/ajustes"
      element={
        <RutaPrivada>
          <MiInmobiliariaPanel />
        </RutaPrivada>
      }
    />

    {/* Estadísticas de una organización puntual */}
    <Route
      path="/organizaciones/estadisticas/:id"
      element={
        <RutaPrivada>
          <EstadisticasPanel />
        </RutaPrivada>
      }
    />

    {/* Panel de superadmin: aprobar/suspender/activar dominios */}
    <Route
      path="/admin/organizaciones"
      element={
        <RutaAdmin>
          <AdminOrganizacionesPage />
        </RutaAdmin>
      }
    />
  </>
);
