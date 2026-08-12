import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { descargas, ordenSO } from "@/data/descargas";

function CommandRow({ osKey }) {
  const d = descargas[osKey];
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(d.cli);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-primero/80">{d.cliLabel}</p>
      <div className="flex items-center gap-2 rounded-md bg-black/40 p-1 pl-4">
        <code className="flex-1 overflow-x-auto whitespace-nowrap py-2 font-mono text-sm text-primero">
          <span className="mr-2 select-none text-tercero">$</span>
          {d.cli}
        </code>
        <button
          type="button"
          onClick={copiar}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-primero transition-colors hover:bg-white/20"
          aria-label={`Copiar comando para ${d.nombre}`}
        >
          {copiado ? (
            <>
              <Check className="size-3.5" /> Copiado
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function CliInstall() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <div className="bg-segundo/80 p-6 text-primero/80 shadow-xl sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primero/10">
            <Terminal className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">
              Instalar desde la terminal
            </h2>
            <p className="text-sm text-primero/60">
              Para equipos técnicos y despliegues en empresas.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {ordenSO.map((key) => (
            <CommandRow key={key} osKey={key} />
          ))}
        </div>
      </div>
    </section>
  );
}
