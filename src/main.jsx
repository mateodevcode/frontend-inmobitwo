// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import "leaflet/dist/leaflet.css"; // ← NUEVO: necesario para que los markers de Leaflet se vean
import { AppProvider } from "./context/AppProvider.jsx";
import AppRouter from "./router/AppRouter.jsx";
import LoaderGlobal from "./components/loader/LoaderGlobal.jsx";
import ConsentimientoBanner from "./components/ConsentimientoBanner.jsx";
import ModalContactoLead from "./components/ModalContactoLead.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <AppRouter />
      <LoaderGlobal />
      <ConsentimientoBanner />
      <ModalContactoLead />
      <Toaster />
    </AppProvider>
  </StrictMode>,
);
