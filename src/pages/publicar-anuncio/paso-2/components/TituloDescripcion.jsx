import { useState } from "react";
import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import DescriptionEditor from "@/pages/publicar-anuncio/paso-2/components/DescriptionEditor";
import FormatoSelector from "@/pages/publicar-anuncio/paso-2/components/FormatoSelector";
import useDetalles from "@/hooks/useDetalles";
import { irArriba } from "@/utils/irArriba";
import { apiBackend } from "@/api/apiBackend";

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

  const [vistaActiva, setVistaActiva] = useState("selector"); // "selector" | "editor"
  const [descripcionEditada, setDescripcionEditada] = useState(
    formDataPropiedad.description ?? "",
  );
  const [errorRefinar, setErrorRefinar] = useState(null);
  const [cargandoRefinar, setCargandoRefinar] = useState(false);

  // Guardar cambios mientras edita
  const handleDescripcionChange = (valor) => {
    setDescripcionEditada(valor);
    setCampo("description")(valor);
  };

  // Refinar descripción con opciones
  const handleRefinar = async (formatoId, tonePersonalizado) => {
    setCargandoRefinar(true);
    setErrorRefinar(null);

    try {
      const response = await apiBackend("/ia/refinar-descripcion", "POST", {
        descripcion: descripcionesIA.formatos.find((f) => f.id === formatoId)
          ?.descripcion,
        tone: tonePersonalizado,
        formato: formatoId,
      });

      if (response.success) {
        // Actualizar la descripción refinada
        handleDescripcionChange(response.data.descripcionRefinada);
        setVistaActiva("editor");
      } else {
        setErrorRefinar(response.error || "Error al refinar");
      }
    } catch {
      setErrorRefinar("Error al conectar con el servidor");
    } finally {
      setCargandoRefinar(false);
    }
  };

  // Usar descripción de IA
  const handleUsarDescripcionIA = (formato) => {
    usarDescripcionIA(formato.descripcion);
    handleDescripcionChange(formato.descripcion);
    setVistaActiva("editor");
  };

  return (
    <Bloque numero={8} titulo="Título y descripción">
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* SECCIÓN 1: TÍTULO */}
        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Título
          </label>
          <div className="rounded-md border border-emerald-500 bg-emerald-50 px-4 py-3">
            <p className="text-lg font-semibold text-emerald-900">
              {tituloGenerado || "Se genera automáticamente..."}
            </p>
          </div>
        </div>

        {/* SECCIÓN 2: DESCRIPCIÓN */}
        <div>
          <label className="mb-3 block text-xl font-semibold text-slate-900">
            Descripción
          </label>

          {/* Tabs: Selector IA o Editor */}
          <div className="flex gap-2 mb-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setVistaActiva("selector")}
              className={`px-4 py-2 font-medium text-sm transition ${
                vistaActiva === "selector"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {descripcionesIA ? "🤖 Opciones IA" : "Editar"}
            </button>

            <button
              type="button"
              onClick={() => setVistaActiva("editor")}
              className={`px-4 py-2 font-medium text-sm transition ${
                vistaActiva === "editor"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✏️ Editar descripción
            </button>
          </div>

          {/* VISTA: Selector de formatos IA */}
          {vistaActiva === "selector" && !descripcionesIA && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
              <div className="text-center">
                <p className="text-slate-700 mb-4">
                  Usa inteligencia artificial para generar descripciones
                  profesionales y atractivas
                </p>
                <button
                  type="button"
                  onClick={generarDescripcionesIA}
                  disabled={generandoIA}
                  className="rounded-md border border-segundo bg-segundo px-8 py-3 text-base font-semibold text-white hover:bg-segundo/80 disabled:opacity-50 cursor-pointer select-none active:scale-95 duration-75 transition"
                >
                  {generandoIA
                    ? "🤖 Creando descripciones..."
                    : "🤖 Generar descripciones con IA"}
                </button>
              </div>
            </div>
          )}

          {/* VISTA: Selector de formatos (después de generar) */}
          {vistaActiva === "selector" && descripcionesIA && (
            <FormatoSelector
              formatos={descripcionesIA.formatos}
              onSeleccionar={handleUsarDescripcionIA}
              onRegenerar={generarDescripcionesIA}
              onRefinar={handleRefinar}
              cargando={generandoIA || cargandoRefinar}
              error={errorRefinar}
            />
          )}

          {/* VISTA: Editor visual */}
          {vistaActiva === "editor" && (
            <DescriptionEditor
              value={descripcionEditada}
              onChange={handleDescripcionChange}
              placeholder="Describe el inmueble: zona, acabados, estado, cercanía a servicios, ventajas, etc..."
            />
          )}

          {/* Botón para generar si no hay descripciones */}
          {vistaActiva === "editor" && !descripcionesIA && (
            <button
              type="button"
              onClick={generarDescripcionesIA}
              disabled={generandoIA}
              className="mt-4 w-full rounded-md border border-segundo bg-segundo/10 px-6 py-3 text-base font-semibold text-segundo hover:bg-segundo/20 disabled:opacity-50 cursor-pointer select-none active:scale-95 duration-75 transition"
            >
              {generandoIA
                ? "🤖 Creando descripciones..."
                : "💡 O genera con IA"}
            </button>
          )}
        </div>

        {/* SECCIÓN 3: CONTINUAR */}
        <button
          type="button"
          onClick={async (e) => {
            onSubmit(e);
            await new Promise((resolve) => setTimeout(resolve, 50));
            irArriba();
          }}
          disabled={loading}
          className="w-full rounded-md bg-tercero px-6 py-3 text-base font-bold text-white hover:bg-tercero/80 active:scale-[0.99] cursor-pointer select-none disabled:opacity-50 transition"
        >
          {loading ? "Publicando…" : "Continuar a fotos del anuncio →"}
        </button>
      </div>
    </Bloque>
  );
};

export default TituloDescripcion;
