// src/pages/organizacion/paginas/LayoutResolver.jsx
// Dominio propio (modo "organizacion") — la org ya viene resuelta por TenantProvider
import { useTenant } from "@/context/TenantContext.js";
import { getTema } from "@/pages/organizacion/temas/temaRegistry.js";

const LayoutResolver = () => {
  const { organizacionActual } = useTenant();
  const { Layout } = getTema(organizacionActual?.tema);
  return <Layout organizacion={organizacionActual} basePath="" />;
};

export default LayoutResolver;
