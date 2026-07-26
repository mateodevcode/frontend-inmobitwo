// src/features/seleccionar-zona/components/MapControls.js
import L from "leaflet";

/**
 * Zoom control (+/-) con estilo Tailwind.
 * Uso: new createZoomControl().addTo(map)
 */
export function createZoomControl() {
  return new (L.Control.extend({
    options: { position: "bottomright" },
    onAdd: function (map) {
      const container = L.DomUtil.create("div");
      container.className =
        "flex flex-col overflow-hidden shadow-lg border-2 border-black/80 rounded";
      container.innerHTML = `
        <button class="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 font-semibold text-gray-700 cursor-pointer text-xl" title="Acercar">+</button>
        <button class="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-xl font-semibold text-gray-700 cursor-pointer border-t-2 border-black/80 " title="Alejar">−</button>
      `;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      const [btnIn, btnOut] = container.querySelectorAll("button");
      btnIn.addEventListener("click", () => map.zoomIn());
      btnOut.addEventListener("click", () => map.zoomOut());

      return container;
    },
  }))();
}

/**
 * Location control (geolocalización).
 * Uso: new createLocationControl().addTo(map)
 */
export function createLocationControl() {
  return new (L.Control.extend({
    options: { position: "bottomright" },
    onAdd: function (map) {
      const container = L.DomUtil.create("div");
      container.className =
        "rounded overflow-hidden shadow-lg border-2 border-black/80 bg-white";
      container.innerHTML = `
        <button class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 cursor-pointer text-sm text-black/80 font-poppins font-semibold hover:bg-white" title="Tu ubicación">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>Tu ubicación</span>
        </button>
      `;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      container.querySelector("button").addEventListener("click", () => {
        map.locate({ setView: true, maxZoom: 15 });
      });

      return container;
    },
  }))();
}
