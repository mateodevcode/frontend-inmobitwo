import { FaLinux } from "react-icons/fa";
import { PiWindowsLogoFill } from "react-icons/pi";
import { FaApple } from "react-icons/fa";

export const descargas = {
  windows: {
    key: "windows",
    nombre: "Windows",
    detalle: "Windows 10 u 11 · 64-bit",
    extension: ".msi",
    url: "https://descargas.barbershopbbg.com/app.msi",
    filename: "app.msi",
    Icon: PiWindowsLogoFill,
  },
  mac: {
    key: "mac",
    nombre: "macOS",
    detalle: "macOS 12+ · Apple Silicon e Intel",
    extension: ".dmg",
    url: "https://descargas.barbershopbbg.com/app.dmg",
    filename: "app.dmg",
    Icon: FaApple,
  },
  linux: {
    key: "linux",
    nombre: "Linux",
    detalle: "AppImage · Debian, Ubuntu y Fedora",
    extension: ".AppImage",
    url: "https://descargas.barbershopbbg.com/app.AppImage",
    filename: "app.AppImage",
    Icon: FaLinux,
  },
};

export const cliCommands = [
  {
    so: "windows",
    nombre: "Windows",
    cliLabel: "Windows (PowerShell)",
    cli: "Invoke-WebRequest -Uri 'https://descargas.barbershopbbg.com/app.msi' -OutFile 'app.msi'; msiexec /i app.msi",
  },
  {
    so: "windows",
    nombre: "Windows",
    cliLabel: "Windows (CMD)",
    cli: "curl -O https://descargas.barbershopbbg.com/app.msi && msiexec /i app.msi",
  },
  {
    so: "mac",
    nombre: "macOS",
    cliLabel: "macOS",
    cli: "curl -O https://descargas.barbershopbbg.com/app.dmg && open app.dmg",
  },
  {
    so: "linux",
    nombre: "Linux",
    cliLabel: "Linux",
    cli: "wget https://descargas.barbershopbbg.com/app.AppImage && chmod +x app.AppImage && ./app.AppImage",
  },
];

export const ordenSO = ["windows", "mac", "linux"];

export function detectarSO() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Win/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "mac";
  if (/Linux|X11/i.test(ua)) return "linux";
  return null;
}
