// src/features/seleccionar-zona/utils/urlBuilder.js

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildSearchUrl(selectedZone) {
  if (!selectedZone) return null;

  const op = selectedZone.operation || "venta";
  const tipo = selectedZone.tipoInmueble || "viviendas";

  let locationSlug;

  switch (selectedZone.type) {
    case "barrio": {
      const b = slugify(selectedZone.name);
      const m = slugify(selectedZone.mpioName || "");
      const d = slugify(selectedZone.dptoName || "");
      locationSlug = `${b}-${m}-${d}`;
      break;
    }
    case "municipio": {
      const m = slugify(selectedZone.name);
      const d = slugify(selectedZone.dptoName || "");
      locationSlug = `${m}-${d}`;
      break;
    }
    case "departamento":
    default:
      locationSlug = slugify(selectedZone.name);
      break;
  }

  return `/${op}-${tipo}/${locationSlug}`;
}
