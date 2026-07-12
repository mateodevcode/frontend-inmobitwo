// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import "leaflet/dist/leaflet.css"; // ← necesario para que los markers de Leaflet se vean
import { AppProvider } from "./context/AppProvider.jsx";
import { TenantProvider } from "./context/TenantProvider.jsx"; // ← NUEVO
import App from "./App.jsx"; // ← NUEVO: ahora App.jsx sí se usa (puerta del tenant)
import LoaderGlobal from "./components/loader/LoaderGlobal.jsx";
import ConsentimientoBanner from "./components/ConsentimientoBanner.jsx";
import ModalContactoLead from "./components/ModalContactoLead.jsx";

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
