import { useLocation, useNavigate } from "react-router-dom";
import { irArriba } from "@/utils/irArriba";

const HeadPerfilAcceso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const segmento = location.pathname.split("/usuario/tus-datos/")[1];

  return (
    <>
      <div className="h-32 w-10/12 text-3xl font-bold text-black flex items-center">
        <h2 className="">Tu cuenta</h2>
      </div>

      {/* Menu */}
      <div className="w-10/12 gap-4 flex flex-row font-semibold">
        <div
          className={`relative cursor-pointer ${segmento === "perfil" ? 'after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-1 after:bg-[#FF1B1C] after:rounded-md' : ""}`}
          onClick={() => {
            navigate("/usuario/tus-datos/perfil");
            irArriba();
          }}
        >
          <p
            className={`${segmento === "perfil" ? "text-[#FF1B1C]" : "text-black/60"} select-none text-lg`}
          >
            Perfil
          </p>
        </div>
        <div
          className={`relative cursor-pointer ${segmento === "acceso" ? 'after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-1 after:bg-[#FF1B1C] after:rounded-md' : ""}`}
          onClick={() => {
            navigate("/usuario/tus-datos/acceso");
            irArriba();
          }}
        >
          <p
            className={`${segmento === "acceso" ? "text-[#FF1B1C]" : "text-black/60"} select-none text-lg`}
          >
            Acceso y seguridad
          </p>
        </div>
      </div>
    </>
  );
};

export default HeadPerfilAcceso;
