// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.js";
import { useTenant } from "@/context/TenantContext.js";

// Páginas
import Home from "@/pages/Home.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Admin from "@/pages/Admin.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Login from "@/components/login/Login.jsx";
import Registro from "@/components/registro/Registro.jsx";
import PublicarAnuncio from "@/pages/PublicarAnuncio.jsx";
import InfoPublicarAnuncio from "@/pages/InfoPublicarAnuncio.jsx";
import MisAnuncios from "@/pages/MisAnuncios.jsx";
import Anuncio from "@/pages/Anuncio.jsx";
import MiPerfil from "@/pages/MiPerfil.jsx";
import SeguridadAcceso from "@/pages/SeguridadAcceso";
import useTracking from "../hooks/useTracking";
import { useEffect, useRef } from "react";
import Leads from "../pages/Leads";
import Logs from "../pages/Logs";
import ListaPruebaPropiedades from "../pages/ListaPruebaPropiedades";
import PagePropiedadId from "../pages/PagePropiedadId";

// Organizaciones (multi-tenant) — NUEVO
import PaginaOrganizacion from "@/pages/organizacion/PaginaOrganizacion.jsx";
import CrearOrganizacionForm from "@/pages/organizacion/CrearOrganizacionForm.jsx";
import AdminOrganizacionesPage from "@/pages/admin/AdminOrganizacionesPage.jsx";
import AgentesPanel from "@/pages/organizacion/AgentesPanel.jsx";
import MiInmobiliariaPanel from "@/pages/organizacion/MiInmobiliariaPanel.jsx";
import EstadisticasPanel from "@/pages/organizacion/EstadisticasPanel.jsx";
import MisFavoritos from "../pages/MisFavoritos";

// ─────────────────────────────────────────────
// Ruta que requiere estar autenticado
// ─────────────────────────────────────────────
const RutaPrivada = ({ children }) => {
  const { estaAutenticado } = useAppContext();
  return estaAutenticado ? children : <Navigate to="/login" replace />;
};

// ─────────────────────────────────────────────
// Ruta que requiere rol superadmin
// ─────────────────────────────────────────────
const RutaAdmin = ({ children }) => {
  const { estaAutenticado, esSuperAdmin } = useAppContext();
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  if (!esSuperAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─────────────────────────────────────────────
// Ruta que redirige si ya estás autenticado
// (para no mostrar login/registro a usuarios ya logueados)
// ─────────────────────────────────────────────
const RutaPublica = ({ children }) => {
  const { estaAutenticado } = useAppContext();
  return estaAutenticado ? <Navigate to="/" replace /> : children;
};

const AppRouter = () => {
  const { consentimientoTracking } = useAppContext();
  const { modo } = useTenant(); // 'red-social' | 'organizacion'
  const { registrarSesion } = useTracking();
  const sesionIniciada = useRef(false);

  useEffect(() => {
    if (sesionIniciada.current) return;
    if (consentimientoTracking === true) {
      sesionIniciada.current = true;
      registrarSesion();
    }
  }, [consentimientoTracking]);

  // ────────────────────────────────────────────────────────────
  // MODO ORGANIZACIÓN: estamos en el dominio propio de un cliente
  // (ej: www.inmobiliariaoviedo.com). Aquí NO exponemos login,
  // red social, dashboard ni admin — solo el escaparate de esa
  // organización. Es intencional: quien entra por ese dominio
  // solo debe ver la web de esa inmobiliaria.
  // ────────────────────────────────────────────────────────────
  if (modo === "organizacion") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginaOrganizacion />} />
          <Route path="*" element={<PaginaOrganizacion />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // ────────────────────────────────────────────────────────────
  // MODO RED SOCIAL: tus rutas de siempre + las nuevas de
  // organizaciones bajo el dominio principal.
  // ────────────────────────────────────────────────────────────
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas — cualquiera puede acceder */}

        {/* <Route path="/propiedades/:id" element={<PropiedadDetalle />} /> */}
        {/* Informacion para publicar anuncio */}

        <Route path="/leads" element={<Leads />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/lista-propiedades" element={<ListaPruebaPropiedades />} />

        <Route
          path="/info/publicar-anuncio"
          element={
            <RutaPrivada>
              <InfoPublicarAnuncio />
            </RutaPrivada>
          }
        />
        {/* Publicar anuncio  */}
        <Route
          path="/info/publicar-anuncio/publicar"
          element={
            <RutaPrivada>
              <PublicarAnuncio />
            </RutaPrivada>
          }
        />

        {/* Listas de favoritos  */}
        <Route
          path="/usuario/favoritos"
          element={
            <RutaPrivada>
              <MisFavoritos />
            </RutaPrivada>
          }
        />

        {/* Listas de anuncios  */}
        <Route
          path="/usuario/mis-anuncios"
          element={
            <RutaPrivada>
              <MisAnuncios />
            </RutaPrivada>
          }
        />

        {/* Anuncio id  */}
        <Route
          path="/usuario/mis-anuncios/anuncio/:id"
          element={
            <RutaPrivada>
              <Anuncio />
            </RutaPrivada>
          }
        />

        {/* usuario tus datos  */}
        <Route
          path="/usuario/tus-datos/perfil"
          element={
            <RutaPrivada>
              <MiPerfil />
            </RutaPrivada>
          }
        />

        {/* usuario tus datos  */}
        <Route
          path="/usuario/tus-datos/acceso"
          element={
            <RutaPrivada>
              <SeguridadAcceso />
            </RutaPrivada>
          }
        />

        {/* Solo si NO estás logueado */}
        <Route
          path="/login"
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          }
        />
        <Route
          path="/registro"
          element={
            <RutaPublica>
              <Registro />
            </RutaPublica>
          }
        />

        {/* Requiere login */}
        <Route
          path="/dashboard"
          element={
            <RutaPrivada>
              <Dashboard />
            </RutaPrivada>
          }
        />

        <Route
          path="/"
          element={
            <RutaPrivada>
              <Home />
            </RutaPrivada>
          }
        />

        <Route
          path="/propiedades/:id"
          element={
            <RutaPrivada>
              <PagePropiedadId />
            </RutaPrivada>
          }
        />

        {/* ──────────────────────────────────────────────
            Organizaciones (multi-tenant) — NUEVO
        ────────────────────────────────────────────── */}

        {/* Vitrina pública de una organización, sin dominio propio */}
        <Route path="/inmobiliarias/:slug" element={<PaginaOrganizacion />} />

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

        {/* Ajustes de mi organización (datos + solicitar dominio) */}
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

        {/* Solo superadmin */}
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <Admin />
            </RutaAdmin>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
