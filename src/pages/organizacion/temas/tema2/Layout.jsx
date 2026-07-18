// src/pages/organizacion/temas/tema1/Layout.jsx
import { Outlet } from "react-router-dom";

const Layout = ({ organizacion, basePath }) => {
  return (
    <div>
      <Outlet context={organizacion} />
    </div>
  );
};

export default Layout;
