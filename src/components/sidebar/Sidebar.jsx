import { useState } from "react";
import FooterSidebar from "./FooterSidebar";
import MiOrganizacionesSidebar from "./MiOrganizacionesSidebar";
import HeaderSidebar from "./HeaderSidebar";
import ItemsSidebar from "./ItemsSidebar";

const Sidebar = () => {
  const [itemSelect, setItemSelect] = useState("feed");

  return (
    <div className="bg-white w-72 md:w-96 border-r border-black/20 font-poppins fixed h-svh left-0">
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <HeaderSidebar />
          <div className="w-full h-px bg-black/20" />
          {/* Items */}
          <ItemsSidebar itemSelect={itemSelect} setItemSelect={setItemSelect} />
          {/* Mis organizaciones */}
          <MiOrganizacionesSidebar
            itemSelect={itemSelect}
            setItemSelect={setItemSelect}
          />
        </div>
        {/* Footer */}
        <FooterSidebar />
      </div>
    </div>
  );
};

export default Sidebar;
