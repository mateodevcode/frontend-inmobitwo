import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionTitle, SelectFiltro } from "../filtros-components";

const OPCIONES_VENTA = {
  min: [10, 20, 50, 75, 100, 150, 200, 300, 500, 800, 1000],
  max: [
    10, 20, 50, 75, 100, 150, 200, 300, 500, 800, 1000, 2000, 5000,
  ],
};

const OPCIONES_ALQUILER = {
  min: [0.5, 1, 1.5, 2, 3, 5],
  max: [1, 2, 3, 5, 8, 10],
};

const aOpciones = (valores, esAlquiler) => [
  ...valores.map((v) => ({
    id: `p${v}`,
    label: esAlquiler
      ? v >= 1
        ? `$${v}M /mes`
        : `$${Math.round(v * 1000)} mil`
      : `$${v}M`,
  })),
  { id: "otro", label: "Otro..." },
];

const Precio = ({ operationSlug }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const esAlquiler =
    operationSlug === "alquiler" || operationSlug === "arriendo";

  const { min: minVals, max: maxVals } = esAlquiler
    ? OPCIONES_ALQUILER
    : OPCIONES_VENTA;

  const opcionesMin = aOpciones(minVals, esAlquiler);
  const opcionesMax = aOpciones(maxVals, esAlquiler);

  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const valueMin = opcionesMin.find((o) => o.id === `p${min}`) ?? null;
  const valueMax = opcionesMax.find((o) => o.id === `p${max}`) ?? null;

  // Estado para el input "Otro..."
  const [otroCampo, setOtroCampo] = useState(null); // "min" | "max" | null
  const [otroValor, setOtroValor] = useState("");

  const actualizar = (campo, opt) => {
    const param = campo === "min" ? "min" : "max";
    const params = new URLSearchParams(searchParams);

    if (!opt) {
      // cleaner
      params.delete(param);
      setOtroCampo((prev) => (prev === campo ? null : prev));
    } else if (opt.id === "otro") {
      setOtroCampo(campo);
      setOtroValor("");
    } else {
      params.set(param, opt.id.slice(1));
      setOtroCampo((prev) => (prev === campo ? null : prev));
    }
    setSearchParams(params);
  };

  const aplicarOtro = () => {
    const valor = Number(otroValor);
    if (!valor || valor <= 0) return;
    const params = new URLSearchParams(searchParams);
    const param = otroCampo === "min" ? "min" : "max";
    // Se ingresa en millones COP y se guarda en millones.
    params.set(param, String(Math.round(valor)));
    setSearchParams(params);
    setOtroCampo(null);
    setOtroValor("");
  };

  return (
    <div className="mb-6">
      <SectionTitle>Precio</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <SelectFiltro
          placeholder="Mín"
          clearable
          options={opcionesMin}
          value={valueMin}
          onChange={(opt) => actualizar("min", opt)}
          getLabel={(o) => o.label}
        />
        <SelectFiltro
          placeholder="Máx"
          clearable
          options={opcionesMax}
          value={valueMax}
          onChange={(opt) => actualizar("max", opt)}
          getLabel={(o) => o.label}
        />
      </div>

      {otroCampo && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={otroValor}
            onChange={(e) =>
              setOtroValor(e.target.value.replace(/[^\d]/g, ""))
            }
            placeholder={`${otroCampo === "min" ? "Mín" : "Máx"} $M`}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-600"
          />
          <button
            type="button"
            onClick={aplicarOtro}
            className="rounded-md bg-tercero px-4 py-2 text-sm font-semibold text-white hover:bg-tercero/80 disabled:opacity-50"
            disabled={!otroValor}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default Precio;
