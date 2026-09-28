import { useState } from "react";
import DOMPurify from "dompurify";

/**
 * Selector de formatos de descripción generados con IA
 * Muestra 3 opciones: moderno, narrativo, técnico
 * Con preview, edición y opciones de refinamiento
 */
export function FormatoSelector({
  formatos,
  onSeleccionar,
  onRegenerar,
  onRefinar,
  cargando = false,
  error = null,
}) {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [tonePersonalizado, setTonePersonalizado] = useState("");

  if (!formatos || formatos.length === 0) {
    return null;
  }

  const handleSeleccionar = (formato) => {
    setFormatoSeleccionado(formato.id);
    setVistaPrevia(true);
  };

  const handleUsarFormato = (formato) => {
    onSeleccionar(formato);
    setFormatoSeleccionado(null);
  };

  const handleRefinar = (formatoId, tone) => {
    if (onRefinar) {
      onRefinar(formatoId, tone);
      setTonePersonalizado("");
    }
  };

  const formatoActual = formatos.find((f) => f.id === formatoSeleccionado);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Si no hay formato seleccionado, mostrar las 3 opciones */}
      {!formatoSeleccionado && (
        <>
          <div className="grid gap-4">
            {formatos.map((formato) => (
              <div
                key={formato.id}
                className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer"
                onClick={() => handleSeleccionar(formato)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {formato.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {formato.caracteristicas}
                    </p>
                  </div>
                  <div className="text-lg">
                    {formato.id === "moderno" && "⚡"}
                    {formato.id === "narrativo" && "📖"}
                    {formato.id === "tecnico" && "🔧"}
                  </div>
                </div>

                {/* Preview truncado */}
                <p className="text-sm text-slate-700 line-clamp-3 mt-3">
                  {formato.descripcion.replace(/<[^>]*>/g, "")}
                </p>

                {/* CTA */}
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Ver más →
                </button>
              </div>
            ))}
          </div>

          {/* Regenerar */}
          <button
            type="button"
            onClick={onRegenerar}
            disabled={cargando}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition"
          >
            {cargando ? "Regenerando..." : "🔄 Regenerar todas las opciones"}
          </button>
        </>
      )}

      {/* Vista detallada del formato seleccionado */}
      {formatoSeleccionado && formatoActual && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {formatoActual.id === "moderno" && "⚡"}
                {formatoActual.id === "narrativo" && "📖"}
                {formatoActual.id === "tecnico" && "🔧"}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {formatoActual.nombre}
                </h3>
                <p className="text-xs text-slate-600">
                  {formatoActual.caracteristicas}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg p-4 mb-6">
            {vistaPrevia ? (
              <div
                className="prose prose-sm max-w-none text-sm text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(formatoActual.descripcion),
                }}
              />
            ) : (
              <p className="text-sm text-slate-700 whitespace-pre-line">
                {formatoActual.descripcion.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>

          {/* Opciones de refinamiento */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-slate-900">
              Refinar tono (opcional):
            </label>
            <div className="flex gap-2 flex-wrap">
              {["más corto", "más formal", "más casual", "más técnico"].map(
                (tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() =>
                      setTonePersonalizado(
                        tonePersonalizado === tone ? "" : tone,
                      )
                    }
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      tonePersonalizado === tone
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 border border-slate-300 hover:border-blue-400"
                    }`}
                  >
                    {tone}
                  </button>
                ),
              )}
            </div>
            {tonePersonalizado && (
              <input
                type="text"
                value={tonePersonalizado}
                onChange={(e) => setTonePersonalizado(e.target.value)}
                placeholder="O escribe tu propio refinamiento..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400"
              />
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleUsarFormato(formatoActual)}
              className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              ✅ Usar este formato
            </button>

            {tonePersonalizado && onRefinar && (
              <button
                type="button"
                onClick={() =>
                  handleRefinar(formatoSeleccionado, tonePersonalizado)
                }
                disabled={cargando}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {cargando ? "Refinando..." : "✨ Refinar"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setFormatoSeleccionado(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              ← Atrás
            </button>
          </div>

          {/* Toggle Preview */}
          <button
            type="button"
            onClick={() => setVistaPrevia(!vistaPrevia)}
            className="mt-4 w-full text-xs text-slate-600 hover:text-slate-900"
          >
            {vistaPrevia ? "Ver texto plano" : "Ver vista previa formateada"}
          </button>
        </div>
      )}
    </div>
  );
}

export default FormatoSelector;
