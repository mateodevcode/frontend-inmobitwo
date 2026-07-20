import HeaderInmobitwo from "@/components/publicar-anuncio/info-publicar/HeaderInmobitwo";
import { SlidersHorizontal } from "lucide-react";
import { getInitials } from "@/lib/getInitials";
import { useAppContext } from "@/context/AppContext";
import { MdOutlineModeEdit } from "react-icons/md";
import HeadPerfilAcceso from "./HeadPerfilAcceso";
import { AiOutlineDelete } from "react-icons/ai";
import { data_perfil_usuario } from "@/data/data_perfil_usuario";
import { useEffect, useState } from "react";
import { apiBackend } from "@/api/apiBackend.js";
import useUsuarios from "@/hooks/useUsuarios";
import { mapearApiAFormDataUsuario } from "@/hooks/useResetForm";
import { useNavigate } from "react-router-dom";
import { irArriba } from "@/utils/irArriba";

const Perfil = () => {
  const {
    usuario,
    iniciarCarga,
    setFormDataUsuario,
    terminarCarga,
    formDataUsuario,
  } = useAppContext();
  const [editarUsuario, setEditarUsuario] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleChange, actualizarUsuario, handleChangeFile } = useUsuarios();
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [previewPrincipal, setPreviewPrincipal] = useState(null);
  const [eliminarFoto, setEliminarFoto] = useState(false);

  const cargarUsuario = async (usuarioId) => {
    try {
      iniciarCarga();
      const res = await apiBackend(
        `/usuarios/${usuarioId}?fields=id,name,email,telefono,image_url,public_id`,
      );
      const { success, data } = res;
      if (success) {
        setFormDataUsuario(mapearApiAFormDataUsuario(data));
      }
    } catch (error) {
      console.error("Error cargando propiedad:", error);
    } finally {
      terminarCarga();
    }
  };

  useEffect(() => {
    if (usuario.id) {
      // Hay id en la URL => flujo normal, traer datos y saltar a paso 2
      cargarUsuario(usuario.id);
      return;
    }
  }, [usuario.id]);

  return (
    <div className="flex flex-col font-montserrat relative items-center">
      <HeaderInmobitwo />
      <HeadPerfilAcceso />

      {/* contenido */}
      <div className="w-10/12 min-h-svh mb-20">
        <div className="flex items-center my-8 gap-4 text-blue-700 cursor-pointer select-none hover:text-blue-600">
          <SlidersHorizontal className="text-2xl" />
          <p className="text-xl font-semibold hover:underline">
            Gestionar las notificaciones y el idioma
          </p>
        </div>

        {/* Tus datos */}
        <div className="w-11/12 md:w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10">
          <div>
            <h3 className="text-xl font-bold text-black">Tus datos</h3>
            <p className="text-lg mt-2 text-black/80">
              Estos datos solo se mostrarán cuando contactes con anunciantes o
              publiques un anuncio en inmobitwo.
            </p>
            <div className="my-4">
              <div className="flex gap-6 items-center">
                {previewPrincipal || formDataUsuario.image_url ? (
                  <div className="w-36 h-36 rounded-full font-semibold flex items-center justify-center text-5xl relative">
                    <img
                      src={previewPrincipal || formDataUsuario.image_url}
                      alt={formDataUsuario.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 text-rose-400 bg-rose-200 p-4 rounded-full font-semibold flex items-center justify-center text-5xl">
                    {getInitials(formDataUsuario.name)}
                  </div>
                )}
                <div className="flex flex-col">
                  {editarUsuario ? (
                    <p className="text-xl text-black">
                      Una buena foto transmite más confianza
                    </p>
                  ) : (
                    <p className="font-semibold text-black text-xl">
                      {formDataUsuario.name}
                    </p>
                  )}
                  {editarUsuario ? (
                    <div className="text-xl flex items-center gap-6 mt-2">
                      {editarUsuario && !formDataUsuario.image_url && (
                        <button className="text-blue-700 font-semibold hover:underline hover:text-blue-600 cursor-pointer select-none active:scale-95 duration-75 transition relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleChangeFile(
                                e,
                                setImagenPrincipal,
                                setPreviewPrincipal,
                              )
                            }
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                          />
                          Subir foto
                        </button>
                      )}
                      {editarUsuario && formDataUsuario.image_url && (
                        <button className="text-blue-700 font-semibold hover:underline hover:text-blue-600 cursor-pointer select-none active:scale-95 duration-75 transition relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleChangeFile(
                                e,
                                setImagenPrincipal,
                                setPreviewPrincipal,
                              )
                            }
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                          />
                          Cambiar foto
                        </button>
                      )}

                      {editarUsuario && formDataUsuario.image_url && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormDataUsuario((prev) => ({
                              ...prev,
                              image_url: null,
                              public_id: null,
                            }));
                            setEliminarFoto(true);
                          }}
                          className="text-blue-700 font-semibold hover:underline hover:text-blue-600 cursor-pointer select-none active:scale-95 duration-75 transition"
                        >
                          Eliminar foto
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl lowercase">{formDataUsuario.email}</p>
                  )}
                </div>
              </div>
            </div>

            {editarUsuario && (
              <>
                <div className="flex flex-col gap-2 mt-8">
                  <p className="font-semibold text-lg text-black">Nombre</p>
                  <input
                    type="text"
                    value={formDataUsuario.name}
                    name="name"
                    onChange={handleChange}
                    className="border border-black/50 p-3 w-80 text-black"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-8">
                  <p className="font-semibold text-lg text-black">Teléfono</p>
                  <div className="flex flex-row items-center relative">
                    <p className="p-3 border-r border-black/50 absolute">+34</p>
                    <input
                      type="text"
                      value={formDataUsuario.telefono ?? ""}
                      name="telefono"
                      onChange={handleChange}
                      className="p-3 text-black border border-black/50 w-80 pl-16"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {editarUsuario && (
            <div className="flex flex-col items-start mt-6">
              <p className="text-lg font-semibold text-black">
                Tus datos de acceso
              </p>
              <button
                className="text-lg font-semibold text-blue-700 hover:text-blue-600 cursor-pointer select-none active:scale-95 duration-75 transition mt-2"
                onClick={() => {
                  navigate("/usuario/tus-datos/acceso");
                  irArriba();
                }}
              >
                Modificar contraseña y email
              </button>
            </div>
          )}

          {editarUsuario ? (
            <div className="flex items-center gap-4">
              <button
                className="rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none mt-8"
                type="button"
                onClick={async (e) => {
                  const res = await actualizarUsuario(
                    e,
                    formDataUsuario.id,
                    setLoading,
                    formDataUsuario,
                    imagenPrincipal,
                    eliminarFoto,
                  );
                  if (res?.success) {
                    setEditarUsuario(false);
                    setEliminarFoto(false);
                    setImagenPrincipal(null);
                  }
                }}
              >
                {loading ? "Cargando" : "Guardar cambios"}
              </button>
              <button
                className="rounded-md bg-black px-6 py-2 text-lg md:text-lg font-bold text-white hover:bg-black/80 active:scale-[0.99] cursor-pointer select-none mt-8"
                type="button"
                onClick={() => setEditarUsuario(!editarUsuario)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600 mt-4"
              type="button"
              onClick={() => setEditarUsuario(!editarUsuario)}
            >
              <MdOutlineModeEdit className="text-xl" />
              <p className="font-semibold text-lg">Editar datos</p>
            </button>
          )}
        </div>

        <div className="w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between mt-10 border border-black/10">
          <div>
            <h3 className="text-xl font-bold text-black">
              Perfil para alquilar habitación
            </h3>
            <p className="text-lg mt-2 text-black/80">
              Podrás compartir estos datos cuando contactes con anunciantes de
              habitación.
            </p>
            <ul className="list-disc mx-5 mt-4">
              {data_perfil_usuario.map((data, i) => {
                return (
                  <li key={i} className="my-1">
                    {data}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center justify-between w-full mt-4">
            <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600">
              <MdOutlineModeEdit className="text-xl" />
              <p className="font-semibold text-lg">Editar datos</p>
            </button>
            <button className="flex items-center gap-2 text-blue-700 cursor-pointer select-none hover:text-blue-600">
              <AiOutlineDelete className="text-xl" />
              <p className="font-semibold text-lg">Borrar perfil</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
