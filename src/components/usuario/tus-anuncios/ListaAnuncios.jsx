import { IoAlertCircle } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import usePropiedades from "@/hooks/usePropiedades";
import { useState } from "react";
import { irArriba } from "@/utils/irArriba";

const ListaAnuncios = ({ propiedades }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { actualizarPropiedad } = usePropiedades();

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
                <div className="flex items-center justify-center w-full h-full bg-rose-50">
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
                  <p className="font-bold text-2xl">
                    {pro.estado === "publicado" ? "Activo" : "Desactivado"}
                  </p>
                  {pro.estado === "publicado" ? (
                    <FaCheckCircle className="text-2xl text-green-600" />
                  ) : (
                    <IoAlertCircle className="text-2xl text-blue-900" />
                  )}
                </div>
                <p className="text-center px-4">
                  {pro.estado === "publicado"
                    ? "Ahora se ve en inmobitwo, pero puedes desactivarlo cuando quieras."
                    : "Ahora no se ve en inmobitwo, pero puedes reactivarlo gratis."}
                </p>
                <button
                  className="bg-stone-300 my-4 py-2 px-4 font-semibold cursor-pointer select-none hover:bg-stone-200"
                  onClick={async (e) => {
                    if (pro.estado === "publicado") {
                      await actualizarPropiedad(e, pro.id, setLoading, {
                        estado: "no_publicado",
                      });
                    } else {
                      await actualizarPropiedad(e, pro.id, setLoading, {
                        estado: "publicado",
                      });
                    }
                  }}
                >
                  {pro.estado === "publicado"
                    ? "Desactivar"
                    : "Reactivar gratis"}
                </button>
              </div>
              <div className="h-full w-full flex flex-col justify-between">
                <div className="flex flex-col p-4 text-sm">
                  <p>400 €/mes 72 m² 2 hab. 2ª planta</p>
                  <p>{pro.titulo}</p>
                  <p>vaqueiros de alzada, 34, 2ª planta, Puerta A,</p>
                  <p>Tineo (Cod. {pro.id})</p>
                </div>

                <div className="flex flex-col items-center p-2 my-2">
                  <button
                    className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer select-none active:scale-95 duration-75 transition"
                    onClick={() => {
                      navigate(`/usuario/mis-anuncios/anuncio/${pro.id}`);
                      irArriba();
                    }}
                  >
                    Gestionar tu anuncio
                  </button>
                  <p className="text-sm">Modificar</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaAnuncios;
