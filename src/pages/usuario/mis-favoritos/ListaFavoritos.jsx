import { useNavigate } from "react-router-dom";
import { TiHeartFullOutline } from "react-icons/ti";
import useFavoritos from "@/hooks/useFavoritos";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { irArriba } from "@/utils/irArriba";

const ListaFavoritos = ({ propiedades }) => {
  const navigate = useNavigate();
  const { toggleFavorito } = useFavoritos();
  const [removingId, setRemovingId] = useState(null);

  const handleQuitarFavorito = async (e, id) => {
    e.stopPropagation();
    setRemovingId(id);

    const res = await toggleFavorito(id);

    if (res.success) {
      // La card se actualizará automáticamente gracias al estado en el hook
    }
    setRemovingId(null);
  };

  return (
    <div className="flex flex-col font-montserrat gap-2 mx-auto p-8">
      {propiedades?.map((pro, i) => {
        return (
          <div
            className="w-full md:w-180 bg-white md:h-96 text-black flex md:flex-row flex-col items-center gap-0 shadow shadow-black/20"
            key={i}
          >
            <div className="bg-white w-full md:w-1/2 h-full p-1">
              {pro.imagen_principal_url === null ? (
                <div className="bg-rose-50 w-full h-full p-4 flex flex-col items-center">
                  <p className="text-red-800 font-semibold text-xl">
                    Tu anuncio no tiene fotos
                  </p>
                  <p className="mt-2 font-semibold text-center">
                    Tu anuncio recibirá un 90% menos de contactos que los que
                    tienen fotos.
                  </p>
                  <button
                    className="text-xl text-blue-500 font-semibold hover:underline text-center mt-6 cursor-pointer select-none"
                    onClick={() => {
                      navigate(`/info/publicar-anuncio/publicar?id=${pro.id}`);
                      irArriba();
                    }}
                  >
                    Añadir tus fotos para recibir más contactos
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-rose-50 relative">
                  {/* Badge favorito */}
                  <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 text-red-600 text-sm font-semibold shadow">
                    <TiHeartFullOutline />
                    Favorito
                  </div>
                  <img
                    src={pro.imagen_principal_url}
                    alt={pro.titulo}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full md:w-1/2 h-full">
              <div className="h-full w-full flex flex-col items-center bg-stone-100">
                <div className="flex items-center justify-center p-4 gap-2">
                  <p className="font-bold text-xl md:text-2xl">
                    {pro.estado === "publicado" ? "Activo" : "Desactivado"}
                  </p>
                  {pro.estado === "publicado" ? (
                    <FaCheckCircle className="text-xl md:text-2xl text-green-600" />
                  ) : (
                    <IoAlertCircle className="text-xl md:text-2xl text-blue-900" />
                  )}
                </div>
                <p className="text-center px-4">
                  {pro.estado === "publicado"
                    ? "Ahora se ve en inmobitwo, pero puedes desactivarlo cuando quieras."
                    : "Ahora no se ve en inmobitwo, pero puedes reactivarlo gratis."}
                </p>
                <button
                  onClick={(e) => handleQuitarFavorito(e, pro.id)}
                  disabled={removingId === pro.id}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium disabled:opacity-50 mt-4 pb-4 md:pb-0"
                >
                  <TiHeartFullOutline className="text-xl" />
                  {removingId === pro.id
                    ? "Quitando..."
                    : "Quitar de favoritos"}
                </button>
              </div>
              <div className="h-full w-full flex flex-col justify-between">
                <div className="flex flex-col p-4 text-sm">
                  <p>
                    {(pro.private_area ?? pro.constructed_area) != null &&
                      `${pro.private_area ?? pro.constructed_area} m² `}
                    {pro.bedroom_count != null &&
                      `${pro.bedroom_count} hab. `}
                    {pro.bathroom_count != null &&
                      `${pro.bathroom_count} baños`}
                  </p>
                  <p>{pro.titulo}</p>
                  <p>{pro.direccion}</p>
                  <p>{pro.city_name ?? ""} (Cod. {pro.id})</p>
                </div>

                <div className="flex flex-col items-center p-2 my-2">
                  <button
                    className="text-base md:text-lg font-semibold text-blue-700 hover:underline cursor-pointer select-none active:scale-95 duration-75 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/inmueble/${pro.id}`);
                      irArriba();
                    }}
                  >
                    Ver propiedad
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaFavoritos;
