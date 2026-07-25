// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.js";
import { useTenant } from "@/context/TenantContext.js";
import { useEffect, useRef } from "react";
import useTracking from "../hooks/useTracking";

import { RutaPrivada, RutaAdmin, RutaPublica } from "@/router/guards.jsx";
import {
  rutasModoOrganizacion,
  rutasOrganizacion,
} from "@/router/organizacionRoutes.jsx";

// Páginas
import Home from "@/pages/Home.jsx";
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
import Leads from "../pages/Leads";
import Logs from "../pages/Logs";
import ListaPruebaPropiedades from "../pages/ListaPruebaPropiedades";
import PagePropiedadId from "../pages/PagePropiedadId";
import MisFavoritos from "../pages/MisFavoritos";
import AdminRutasPage from "../pages/admin/AdminRutasPages";
import PageInicio from "../pages/inicio/PagePrincipal";
import ListaPropiedades from "../pages/lista-propiedades/ListaPropiedades";
import SeleccionarZonaPage from "../features/seleccionar-zona/index.jsx";

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
  // MODO ORGANIZACIÓN: dominio propio de un cliente. Solo el
  // escaparate de esa organización — nada de login/red-social/admin.
  // ────────────────────────────────────────────────────────────
  if (modo === "organizacion") {
    return (
      <BrowserRouter>
        <Routes>{rutasModoOrganizacion}</Routes>
      </BrowserRouter>
    );
  }

  // ────────────────────────────────────────────────────────────
  // MODO RED SOCIAL: rutas de siempre + las de organización
  // importadas de organizacionRoutes.jsx.
  // ────────────────────────────────────────────────────────────
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lista-propiedades" element={<ListaPruebaPropiedades />} />
        <Route path="/" element={<PageInicio />} />
        <Route path="/" element={<PageInicio />} />
        <Route
          path="/info/publicar-anuncio"
          element={
            <RutaPrivada>
              <InfoPublicarAnuncio />
            </RutaPrivada>
          }
        />
        <Route
          path="/info/publicar-anuncio/publicar"
          element={
            <RutaPrivada>
              <PublicarAnuncio />
            </RutaPrivada>
          }
        />
        <Route
          path="/usuario/favoritos"
          element={
            <RutaPrivada>
              <MisFavoritos />
            </RutaPrivada>
          }
        />
        <Route
          path="/usuario/mis-anuncios"
          element={
            <RutaPrivada>
              <MisAnuncios />
            </RutaPrivada>
          }
        />
        <Route
          path="/usuario/mis-anuncios/anuncio/:id"
          element={
            <RutaPrivada>
              <Anuncio />
            </RutaPrivada>
          }
        />
        <Route
          path="/usuario/tus-datos/perfil"
          element={
            <RutaPrivada>
              <MiPerfil />
            </RutaPrivada>
          }
        />
        <Route
          path="/usuario/tus-datos/acceso"
          element={
            <RutaPrivada>
              <SeguridadAcceso />
            </RutaPrivada>
          }
        />
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
        <Route
          path="/feed"
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
        <Route
          path="/leads"
          element={
            <RutaPrivada>
              <Leads />
            </RutaPrivada>
          }
        />
        <Route
          path="/logs"
          element={
            <RutaPrivada>
              <Logs />
            </RutaPrivada>
          }
        />
        {/* ────────────── Organizaciones (multi-tenant) ────────────── */}
        {rutasOrganizacion}
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <Admin />
            </RutaAdmin>
          }
        />
        <Route
          path="/admin/rutas"
          element={
            <RutaAdmin>
              <AdminRutasPage />
            </RutaAdmin>
          }
        />
        {/* ──────────────────────────────────────────────────────────── */}
        {/* NUEVA RUTA DINÁMICA DE BÚSQUEDA (TIPO IDEALISTA) */}
        {/* Captura URLs como /alquiler-viviendas/barranquilla-atlantico */}
        {/* ──────────────────────────────────────────────────────────── */}
        <Route
          path="/busqueda-multizona/:operationAndType"
          element={<SeleccionarZonaPage />}
        />
        <Route
          path="/:operationAndType/:cityAndDepartment"
          element={<ListaPropiedades />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
