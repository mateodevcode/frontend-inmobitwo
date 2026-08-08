import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import InputField from "@/pages/publicar-anuncio/components/InputField";
import useDetalles from "@/hooks/useDetalles";

const COLORES_NIVEL = {
  sobrevalorado: "text-red-600",
  alto: "text-amber-600",
  optimo: "text-emerald-700",
  bueno: "text-emerald-700",
  oportunidad: "text-orange-600",
};

const formato = (n) =>
  n != null ? `$${Number(n).toLocaleString("es-CO")}` : "—";

const Precio = () => {
  const {
    formDataPropiedad,
    setCampo,
    precioSugerido,
    validacionPrecio,
  } = useDetalles({ calcularPrecio: true });

  return (
    <Bloque numero={7} titulo="Precio del inmueble">
      <div className="flex max-w-96 flex-col gap-6">
        {precioSugerido && (
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Precio sugerido por mercado
            </p>
            <p className="text-lg font-bold text-slate-900">
              {formato(precioSugerido.precio_sugerido_min)} —{" "}
              {formato(precioSugerido.precio_sugerido_max)}
            </p>
            <p className="text-sm text-slate-500">
              {formato(precioSugerido.price_per_sqm_sugerido)} por m²
            </p>
          </div>
        )}

        <InputField
          label="Precio"
          description="pesos colombianos (COP)"
          value={formDataPropiedad.precio ?? ""}
          onChange={(e) => setCampo("precio")(e.target.value)}
          unit="COP"
          numeric
        />

        {validacionPrecio && (
          <p
            className={`text-base font-medium ${
              COLORES_NIVEL[validacionPrecio.nivel] ?? "text-slate-700"
            }`}
          >
            {validacionPrecio.mensaje}
          </p>
        )}
      </div>
    </Bloque>
  );
};

export default Precio;
