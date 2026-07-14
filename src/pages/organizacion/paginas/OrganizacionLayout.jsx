// src/pages/organizacion/paginas/OrganizacionLayout.jsx
import { Outlet } from "react-router-dom";
import { useTenant } from "@/context/TenantContext.js";
import OrganizacionNav from "./OrganizacionNav.jsx";

const OrganizacionLayout = () => {
  const { organizacionActual } = useTenant();

  return (
    <div>
      <OrganizacionNav basePath="" organizacion={organizacionActual} />
      <Outlet context={organizacionActual} />
    </div>
  );
};

export default OrganizacionLayout;
