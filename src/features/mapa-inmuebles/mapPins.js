// src/features/mapa-inmuebles/mapPins.js
import { formatPrecioPin } from "@/utils/formatPrecio";

export function createClusterIcon(count) {
  const el = document.createElement("div");
  el.className =
    "flex items-center justify-center w-10 h-10 rounded-full bg-[#e6007a] text-white text-sm font-bold shadow-lg cursor-pointer";
  el.textContent = count;
  return el;
}

export function createPricePin(props, isSelected) {
  const el = document.createElement("div");
  el.className = `price-pin${isSelected ? " selected" : ""}`;
  el.textContent = formatPrecioPin(props.precio, props.operacion);
  return el;
}
