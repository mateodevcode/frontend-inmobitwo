// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import "maplibre-gl/dist/maplibre-gl.css"; // ← MapLibre GL JS
import { AppProvider } from "./context/AppProvider.jsx";
import { TenantProvider } from "./context/TenantProvider.jsx"; // ← NUEVO
import App from "./App.jsx"; // ← NUEVO: ahora App.jsx sí se usa (puerta del tenant)
import LoaderGlobal from "./components/loader/LoaderGlobal.jsx";
import ConsentimientoBanner from "./components/consentimiento-banner/ConsentimientoBanner.jsx";
import ModalContactoLead from "./components/modales/ModalContactoLead.jsx";
import { invoke } from "@tauri-apps/api/core";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <TenantProvider>
        <App />
        <LoaderGlobal />
        <ConsentimientoBanner />
        <ModalContactoLead />
        <Toaster />
      </TenantProvider>
    </AppProvider>
  </StrictMode>,
);
