import FiltrosPrincipal from "./FiltrosPrincipal";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import NavbarListaPropiedades from "./NavbarListaPropiedades";
import ListadoDePropiedades from "./ListadoDePropiedades";
import HeadListaPropiedades from "./HeadListaPropiedades";

const ListaPropiedades = () => {
  return (
    <div className="flex items-center flex-col w-full font-poppins">
      <NavbarListaPropiedades />
      <HeadListaPropiedades />

      <div className="w-full bg-gray-100">
        <div className="flex items-start w-[90%] 2xl:w-10/12 mx-auto">
          <FiltrosPrincipal />
          <ListadoDePropiedades />
        </div>
      </div>

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default ListaPropiedades;
