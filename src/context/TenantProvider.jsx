// src/context/TenantProvider.jsx
import { useEffect, useState } from "react";
import { TenantContext } from "@/context/TenantContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { MAIN_HOSTS } from "@/config/tenantConfig.js";

// modo: 'cargando' | 'red-social' | 'organizacion'
export const TenantProvider = ({ children }) => {
  const [organizacionActual, setOrganizacionActual] = useState(null);
  const [modo, setModo] = useState("cargando");

  useEffect(() => {
    const resolver = async () => {
      const host = window.location.host; // incluye :puerto en local

      // Dominio propio de la plataforma -> ni siquiera llamamos al backend
      if (MAIN_HOSTS.includes(host)) {
        setModo("red-social");
        return;
      }

      try {
        const res = await apiBackend("/organizaciones/resolve-tenant");

        if (res.success && res.data) {
          setOrganizacionActual(res.data);
          setModo("organizacion");
        } else {
          // Host desconocido y sin coincidencia -> cae a red social
          // (evita pantallas rotas si alguien entra por una IP o dominio raro)
          setModo("red-social");
        }
      } catch (error) {
        console.error("❌ Error resolviendo tenant:", error);
        setModo("red-social");
      }
    };

    resolver();
  }, []);

  return (
    <TenantContext.Provider
      value={{
        organizacionActual,
        modo,
        esModoOrganizacion: modo === "organizacion",
        cargandoTenant: modo === "cargando",
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};
