import { Download } from "lucide-react";
import { descargas, ordenSO } from "@/data/descargas.jsx";

export function AllInstallers() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-segundo sm:text-3xl">
          Todos los instaladores
        </h2>
        <p className="mt-3 text-segundo/60">
          Elige la versión que corresponde a tu equipo.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {ordenSO.map((key) => {
          const d = descargas[key];
          const { Icon } = d;
          return (
            <div
              key={key}
              className="flex flex-col rounded-3xl border border-segundo/10 bg-primero p-6 transition-colors hover:border-tercero/40"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-segundo/5 text-segundo">
                <Icon className="size-8" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-segundo">
                {d.nombre}
              </h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-segundo/60">
                {d.detalle}
              </p>
              <a
                href={d.url}
                download={d.filename}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-segundo/10 bg-primero px-4 py-2.5 text-sm font-semibold text-segundo transition-colors hover:bg-segundo/5"
              >
                <Download className="size-4 text-tercero" />
                Descargar {d.extension}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
