import { useState } from "react";
import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import TextareaField from "@/pages/publicar-anuncio/components/TextareaField";
import useDetalles from "@/hooks/useDetalles";
import { irArriba } from "@/utils/irArriba";

const TituloDescripcion = () => {
  const {
    formDataPropiedad,
    setCampo,
    onSubmit,
    loading,
    descripcionesIA,
    generandoIA,
    generarDescripcionesIA,
    usarDescripcionIA,
    tituloGenerado,
  } = useDetalles();

  const [formatoSeleccionado, setFormatoSeleccionado] = useState(null);

  return (
    <Bloque numero={8} titulo="Título y descripción">
      <div className="flex max-w-96 flex-col gap-4">
        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Título
          </label>
          <div className="w-96 rounded-md border border-emerald-500 bg-emerald-50 px-4 py-3">
            <p className="text-lg font-semibold text-emerald-900">
              {tituloGenerado || "Se genera automáticamente..."}
            </p>
          </div>
        </div>

        <TextareaField
          label="Descripción"
          value={formDataPropiedad.description ?? ""}
          onChange={(e) => setCampo("description")(e.target.value)}
          placeholder="Describe el inmueble: zona, acabados, estado, cercanía a servicios…"
        />

        <button
          type="button"
          onClick={generarDescripcionesIA}
          disabled={generandoIA}
          className="rounded-md border border-segundo bg-segundo px-6 py-3 text-base font-semibold text-primero hover:bg-segundo/80 disabled:opacity-50 cursor-pointer select-none active:scale-95 duration-75 transition w-full"
        >
          {generandoIA ? "Creando descripciones con IA..." : "Generar con IA"}
        </button>

        {descripcionesIA && !formatoSeleccionado && (
          <div className="flex flex-col gap-5">
            {descripcionesIA.formatos.map((f) => (
              <div
                key={f.id}
                className="rounded-md border border-slate-200 p-4"
              >
                <p className="text-base font-bold text-slate-900">{f.nombre}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {f.caracteristicas}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                  {f.descripcion}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    usarDescripcionIA(f.descripcion);
                    setFormatoSeleccionado(f.id);
                  }}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Usar este formato
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={generarDescripcionesIA}
              disabled={generandoIA}
              className="w-fit text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
            >
              Regenerar
            </button>
          </div>
        )}

        {formatoSeleccionado && (
          <button
            type="button"
            onClick={() => setFormatoSeleccionado(null)}
            className="w-fit text-sm font-semibold text-blue-600 hover:underline"
          >
            Cambiar formato
          </button>
        )}

        <button
          type="button"
          onClick={async (e) => {
            onSubmit(e);
            await new Promise((resolve) => setTimeout(resolve, 50));
            irArriba();
          }}
          disabled={loading}
          className="w-full rounded-md bg-tercero px-6 py-3 text-base font-bold text-white hover:bg-tercero/80 active:scale-[0.99] cursor-pointer select-none disabled:opacity-50"
        >
          {loading ? "Publicando…" : "Continuar a fotos del anuncio"}
        </button>
      </div>
    </Bloque>
  );
};

export default TituloDescripcion;
