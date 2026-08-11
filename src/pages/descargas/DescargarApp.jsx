import { useEffect, useState } from "react";

export default function DescargarApp() {
  const [so, setSO] = useState(null);

  useEffect(() => {
    const detectOS = () => {
      if (navigator.userAgent.includes("Win")) return "windows";
      if (navigator.userAgent.includes("Mac")) return "mac";
      if (navigator.userAgent.includes("Linux")) return "linux";
      return null;
    };
    setSO(detectOS());
  }, []);

  const descargas = {
    windows: {
      nombre: "Windows",
      url: "https://descargas.barbershopbbg.com/app.msi",
      icon: "🪟",
    },
    mac: {
      nombre: "macOS",
      url: "https://descargas.barbershopbbg.com/app.dmg",
      icon: "🍎",
    },
    linux: {
      nombre: "Linux",
      url: "https://descargas.barbershopbbg.com/app.AppImage",
      icon: "🐧",
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Descargar InmobiTwo</h1>

      {so && (
        <div className="bg-blue-100 p-4 rounded mb-6">
          <p className="text-lg">
            📱 Detectamos que usas <strong>{descargas[so].nombre}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(descargas).map(([key, desc]) => (
          <a
            key={key}
            href={desc.url}
            download
            className={`p-6 rounded-lg text-center transition ${
              so === key
                ? "bg-green-500 text-white scale-105"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <div className="text-4xl mb-2">{desc.icon}</div>
            <h3 className="font-bold">{desc.nombre}</h3>
            <p className="text-sm">Descargar</p>
          </a>
        ))}
      </div>

      {/* CLI */}
      <div className="mt-8 bg-gray-900 text-white p-4 rounded">
        <h3 className="font-bold mb-4">📦 Instalar por CLI</h3>

        <div className="mb-4">
          <p className="text-sm mb-1">Windows (PowerShell):</p>
          <code className="bg-black p-2 block text-xs">
            curl -O https://descargas.barbershopbbg.com/app.exe; .\app.exe
          </code>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-1">macOS:</p>
          <code className="bg-black p-2 block text-xs">
            curl -O https://descargas.barbershopbbg.com/app.dmg && open app.dmg
          </code>
        </div>

        <div>
          <p className="text-sm mb-1">Linux:</p>
          <code className="bg-black p-2 block text-xs">
            wget https://descargas.barbershopbbg.com/app.AppImage && chmod +x
            app.AppImage && ./app.AppImage
          </code>
        </div>
      </div>
    </div>
  );
}
