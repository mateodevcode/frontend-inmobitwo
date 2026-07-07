// src/pages/Home.jsx

import Sidebar from "@/components/sidebar/Sidebar.jsx";
import Principal from "@/components/principal/Principal.jsx";
import Actividad from "@/components/principal/actividad/Actividad.jsx";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import ModalUser from "@/components/modales/ModalUser.jsx";
import ModalAgregarPropiedad from "@/components/modales/ModalAgregarPropiedad.jsx";
import ModalConfirmarEliminarPropiedad from "@/components/modales/ModalConfirmarEliminarPropiedad.jsx";
import ModalSidebar from "@/components/modales/ModalSidebar";
import ModalActividades from "@/components/modales/ModalActividades";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <div className="min-h-svh flex justify-between bg-gray-100 relative">
        <div className="md:flex hidden">
          <Sidebar />
        </div>
        <Principal />

        <div className="md:flex hidden">
          <Actividad />
        </div>
        <style>{scrollbarStyles.default}</style>
      </div>

      <ModalUser />
      <ModalAgregarPropiedad />
      <ModalConfirmarEliminarPropiedad />
      <ModalSidebar />
      <ModalActividades />
    </div>
  );
};

export default Home;
