// src/pages/PagePropiedadId.jsx

import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import PropiedadId from "../components/propiedades/propiedadId/PropiedadId";
import ModalUserPropiedadId from "../components/modales/ModalUserPropiedadId";

const PagePropiedadId = () => {
  return (
    <div className="">
      <PropiedadId />

      <style>{scrollbarStyles.default}</style>

      <ModalUserPropiedadId />
    </div>
  );
};

export default PagePropiedadId;
