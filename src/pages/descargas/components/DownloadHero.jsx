import { useState } from "react";
import { Download, ShieldCheck, RefreshCw } from "lucide-react";
import { descargas, detectarSO, ordenSO } from "@/data/descargas";

export function DownloadHero() {
  const [so] = useState(() => detectarSO());

  const principal = descargas[so ?? "windows"];
  const { Icon } = principal;

  return (
    <section className="relative overflow-hidden font-poppins">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-3xl rounded-full bg-tercero/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-tercero/20 bg-primero px-4 py-1.5 text-sm font-medium text-tercero">
          <span
            className="size-1.5 rounded-full bg-tercero"
            aria-hidden="true"
          />
          Aplicación de escritorio
        </span>

        <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight text-segundo sm:text-6xl">
          Descarga inmobitwo
          <br className="hidden sm:block" /> en tu ordenador
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-segundo/60">
          Publica, gestiona y responde a tus inmuebles desde una app rápida y
          nativa. Para personas que buscan casa y para empresas que gestionan
          carteras enteras.
        </p>

        <div className="mx-auto mt-10 max-w-xl">
          <div className="rounded-3xl border border-segundo/10 bg-primero p-6 shadow-lg shadow-tercero/5 sm:p-8">
            <div className="flex items-center justify-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-full bg-segundo/5 text-segundo">
                <Icon className="size-7" />
              </span>
              <div className="text-left text-montserrat">
                <p className="text-sm font-medium text-segundo/60">
                  {so
                    ? `Detectamos que usas ${principal.nombre}`
                    : "Tu descarga recomendada"}
                </p>
                <p className="font-display text-lg font-bold text-segundo">
                  inmobitwo para {principal.nombre}
                </p>
              </div>
            </div>

            <a
              href={principal.url}
              download={principal.filename}
              className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-tercero px-6 py-4 text-base font-semibold text-primero shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-tercero/80"
            >
              <Download className="size-5 transition-transform group-hover:translate-y-0.5" />
              Descargar para {principal.nombre}
            </a>

            <p className="mt-3 text-sm text-segundo/60">
              {principal.detalle} · Archivo {principal.extension}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-segundo/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-5 text-tercero" /> Descarga segura y
              verificada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="size-5 text-tercero" /> Actualizaciones
              automáticas
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-segundo/60">¿Otro sistema?</span>
            {ordenSO
              .filter((k) => k !== (so ?? "windows"))
              .map((k) => (
                <a
                  key={k}
                  href={descargas[k].url}
                  download={descargas[k].filename}
                  className="font-semibold text-tercero underline-offset-4 hover:underline"
                >
                  {descargas[k].nombre}
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
