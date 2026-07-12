// src/context/TenantContext.js
import { createContext, useContext } from "react";

export const TenantContext = createContext(null);

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant debe usarse dentro de <TenantProvider>");
  }
  return ctx;
};
