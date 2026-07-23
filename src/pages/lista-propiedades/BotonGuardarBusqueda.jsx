import { IoNotificationsSharp } from "react-icons/io5";
import { toast } from "sonner";

const BotonGuardarBusqueda = () => {
  return (
    <div className="bg-septimo w-[25%] h-full rounded-sm flex items-center justify-center flex-col gap-4">
      <h3 className="text-segundo text-sm font-semibold">
        Nuevos anuncios en tu email
      </h3>
      <button
        className="relative flex items-center justify-center gap-2 px-8 bg-black text-white h-11 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 w-10/12 rounded-md"
        type="button"
        onClick={() => toast.success("Gracias por confiar en nosotros.")}
      >
        <IoNotificationsSharp className="text-lg relative z-10 group-hover:text-white transition-colors duration-300 font-semibold" />
        <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
          Guardar búsqueda
        </p>
      </button>
    </div>
  );
};

export default BotonGuardarBusqueda;
