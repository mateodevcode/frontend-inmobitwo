import { useState } from "react";
import { ChevronDown, HardDriveUpload, Plus, X } from "lucide-react";
import usePropiedades from "@/hooks/usePropiedades";
import { Listbox } from "@headlessui/react";
import {
  // agentes,
  // departamentosCiudades,
  estadosPropiedad,
  // tiposPropiedad,
} from "@/data/colombia-data";
import { useAppContext } from "@/context/AppContext";
import useResetForm from "@/hooks/useResetForm";

export default function FormAgregarPropiedad() {
  const {
    // propiedades,
    // setPropiedades,
    formDataPropiedad,
    setFormDataPropiedad,
    // usuario,
    setOpenModalAgregarPropiedad,
  } = useAppContext();

  // const [propiedadId, setPropiedadId] = useState(null);
  const {
    crearPropiedad,
    handleChange,
    handleChangeFile,
    handleChangeMultipleFiles,
    handleDeletePreviewImage,
  } = usePropiedades();
  const { resetFormDataPropiedad } = useResetForm();

  // const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [previewPrincipal, setPreviewPrincipal] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState([]);
  const [planosFiles, setPlanosFiles] = useState([]);
  const [planosPreviews, setPlanosPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // const handleDepartamentoChange = (departamento) => {
  //   setFormDataPropiedad((prev) => ({
  //     ...prev,
  //     departamento,
  //     ciudad: "",
  //   }));
  //   setCiudadesDisponibles(departamentosCiudades[departamento] || []);
  // };

  // const searchUsuario = (id) => {
  //   const usuario = agentes.find((agent) => agent.id === id);
  //   return usuario;
  // };

  const handleCancel = () => {
    resetFormDataPropiedad();
    setImagenPrincipal(null);
    setPreviewPrincipal(null);
    setGaleriaFiles([]);
    setGaleriaPreviews([]);
    setPlanosFiles([]);
    setPlanosPreviews([]);
    setOpenModalAgregarPropiedad(false);
  };

  return (
    <form className="bg-white rounded-xl p-6 text-blackbase-500/70">
      <div className="w-full flex items-center gap-8">
        <div className="w-1/2 flex flex-col gap-2">
          <p className="font-medium text-sm">Nombre Propiedad *</p>
          <input
            type="text"
            placeholder="Nombre de la propiedad"
            name="titulo"
            value={formDataPropiedad.titulo}
            onChange={handleChange}
            className="bg-transparent focus text-blackbase-500/80 border border-blackbase-500/10 w-full text-sm p-4 rounded-md focus:ring-1 focus:ring-orangebase-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex flex-col w-1/2">
          <span className="font-medium text-sm">Estado de propiedad *</span>
          <div className="relative flex-1 rounded-sm mt-2">
            <Listbox
              value={formDataPropiedad.estado}
              onChange={(estado) =>
                setFormDataPropiedad((prev) => ({ ...prev, estado }))
              }
            >
              {({ open }) => (
                <div>
                  <Listbox.Button className="bg-transparent focus text-blackbase-500/80 border border-blackbase-500/10 w-full text-sm p-4 rounded-md focus:ring-1 focus:ring-orangebase-500 focus:border-transparent outline-none transition">
                    {formDataPropiedad.estado ? (
                      <div className="flex items-center gap-3">
                        <span className="capitalize">
                          {formDataPropiedad.estado}
                        </span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-3">
                        Selecciona el estado
                      </span>
                    )}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-blackbase-500/70" />
                    </span>
                  </Listbox.Button>

                  {open && (
                    <Listbox.Options
                      className="absolute z-10 mt-2 w-full bg-white border border-blackbase-500/10 text-blackbase-500/70 rounded-md shadow-lg max-h-60 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
          [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent"
                    >
                      {estadosPropiedad.map((tipo, index) => (
                        <Listbox.Option
                          key={index}
                          value={tipo.value}
                          className={({ active, selected }) =>
                            `cursor-pointer px-4 py-2 ${
                              active ? "bg-blackbase-500/5" : ""
                            } ${
                              selected
                                ? "text-blackbase-500 bg-blackbase-500/10"
                                : ""
                            }`
                          }
                        >
                          {tipo.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  )}
                </div>
              )}
            </Listbox>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2 font-medium">
          Agregar foto principal *
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna 1: Subir imagen */}
          <div className="h-80 relative border-2 border-dashed border-gray-300 rounded-md p-6 gap-2 flex items-center justify-center text-center hover:border-rose-600 transition-colors">
            <div className="border border-black/10 p-2 rounded">
              <HardDriveUpload className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-500">Arrastra y suelta</span>
              <span className="text-rose-600 font-semibold cursor-pointer">
                o haz click aquí
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChangeFile(e, setImagenPrincipal, setPreviewPrincipal)
              }
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          {/* Columna 2: Preview de imagen */}
          <div className="h-80 rounded-md flex items-center justify-center">
            {previewPrincipal || formDataPropiedad.imagen_principal_url ? (
              <div className="relative w-full h-full">
                <img
                  src={
                    previewPrincipal || formDataPropiedad.imagen_principal_url
                  }
                  alt="Vista previa"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                />
                <a
                  href={`${
                    previewPrincipal || formDataPropiedad.imagen_principal_url
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                  Ver original
                </a>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="border border-black/10 p-2 rounded inline-block mb-2">
                  <HardDriveUpload className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm">Vista previa</p>
                <p className="text-xs">La imagen aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 font-medium">
            Galería de imágenes (opcional)
          </p>
          <span className="text-xs text-gray-400">
            {galeriaFiles.length} / 10 imágenes
          </span>
        </div>

        {/* Upload Zone */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-rose-600 transition-colors">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="border border-black/10 p-2 rounded">
              <HardDriveUpload className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">
                Arrastra y suelta múltiples imágenes
              </span>
              <span className="text-rose-600 font-semibold cursor-pointer">
                o haz click aquí para seleccionar
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Máximo 10 imágenes, 10MB cada una
              </span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              handleChangeMultipleFiles(e, setGaleriaFiles, setGaleriaPreviews)
            }
            className="absolute opacity-0 w-full h-full cursor-pointer inset-0"
          />
        </div>

        {/* Preview Grid */}
        {galeriaPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriaPreviews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-md overflow-hidden border border-gray-200 hover:border-rose-600 transition-colors"
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeletePreviewImage(
                      index,
                      setGaleriaFiles,
                      setGaleriaPreviews,
                    )
                  }
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {preview.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 font-medium">
            Planos (opcional)
          </p>
          <span className="text-xs text-gray-400">
            {planosFiles.length} / 10 planos
          </span>
        </div>

        <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-rose-600 transition-colors">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="border border-black/10 p-2 rounded">
              <HardDriveUpload className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">
                Arrastra y suelta los planos
              </span>
              <span className="text-rose-600 font-semibold cursor-pointer">
                o haz click aquí para seleccionar
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Máximo 10 planos, 10MB cada uno
              </span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              handleChangeMultipleFiles(e, setPlanosFiles, setPlanosPreviews)
            }
            className="absolute opacity-0 w-full h-full cursor-pointer inset-0"
          />
        </div>

        {planosPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {planosPreviews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-md overflow-hidden border border-gray-200 hover:border-rose-600 transition-colors"
              >
                <img
                  src={preview.url}
                  alt={`Plano ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeletePreviewImage(
                      index,
                      setPlanosFiles,
                      setPlanosPreviews,
                    )
                  }
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar plano"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {preview.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-black text-white px-5 py-2 rounded-md hover:bg-black/80 transition-colors text-sm cursor-pointer select-none"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={(e) =>
            crearPropiedad(
              e,
              setLoading,
              setImagenPrincipal,
              setPreviewPrincipal,
              imagenPrincipal,
              galeriaFiles,
              setGaleriaFiles,
              setGaleriaPreviews,
              planosFiles,
              setPlanosFiles,
              setPlanosPreviews,
            )
          }
          disabled={loading}
          className={`flex items-center gap-2 text-sm pr-3 pl-2 py-2 rounded-md text-white transition-colors select-none ${
            loading
              ? "bg-rose-600/80 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-600/80 cursor-pointer active:scale-95 duration-75"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? "Creando..." : "Crear propiedad"}</span>
        </button>
      </div>
    </form>
  );
}
