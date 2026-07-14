// src/pages/ListaPruebaPropiedades.jsx

import Principal from "@/components/principal/Principal.jsx";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";

const ListaPruebaPropiedades = () => {
  return (
    <div className="bg-gray-50">
      <div className="min-h-svh flex justify-between bg-gray-100 relative">
        <Principal />

        <style>{scrollbarStyles.default}</style>
      </div>
    </div>
  );
};

export default ListaPruebaPropiedades;
