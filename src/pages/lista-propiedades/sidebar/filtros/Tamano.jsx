import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionTitle, SelectFiltro } from "../filtros-components";

// 40 → 200 (de 20), 250 → 500 (de 50), 600 → 900 (de 100)
const generarPresets = () => {
  const valores = [];
  for (let v = 40; v <= 200; v += 20) valores.push(v);
  for (let v = 250; v <= 500; v += 50) valores.push(v);
  for (let v = 600; v <= 900; v += 100) valores.push(v);
  return valores;
};

const PRESETS = generarPresets();

const aOpciones = (valores) => [
  ...valores.map((v) => ({ id: `t${v}`, label: `${v} m²` })),
  { id: "sin_limite", label: "Sin límite" },
  { id: "otro", label: "Otro..." },
];

const Tamano = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const opciones = aOpciones(PRESETS);
  const opcionesMin = opciones;
  const opcionesMax = opciones;

  const tamMin = searchParams.get("tamMin");
  const tamMax = searchParams.get("tamMax");

  const valueMin = opcionesMin.find((o) => o.id === `t${tamMin}`) ?? null;
  const valueMax = opcionesMax.find((o) => o.id === `t${tamMax}`) ?? null;

  // Estados para el input "Otro..."
  const [otroCampo, setOtroCampo] = useState(null); // "min" | "max" | null
  const [otroValor, setOtroValor] = useState("");

  const actualizar = (campo, opt) => {
    const param = campo === "min" ? "tamMin" : "tamMax";
    const params = new URLSearchParams(searchParams);

    if (!opt) {
      // cleaner / sin límite
      params.delete(param);
      setOtroCampo((prev) => (prev === campo ? null : prev));
    } else if (opt.id === "otro") {
      setOtroCampo(campo);
      setOtroValor("");
    } else if (opt.id === "sin_limite") {
      params.delete(param);
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
    const param = otroCampo === "min" ? "tamMin" : "tamMax";
    params.set(param, String(Math.round(valor)));
    setSearchParams(params);
    setOtroCampo(null);
    setOtroValor("");
  };

  return (
    <div className="mb-6">
      <SectionTitle>Tamaño</SectionTitle>
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
            placeholder={`${otroCampo === "min" ? "Mín" : "Máx"} m²`}
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

export default Tamano;
