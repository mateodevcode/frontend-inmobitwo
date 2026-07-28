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

export function buildSearchUrl(selectedZone, deptNames = {}) {
  if (!selectedZone) return null;

  const op = selectedZone.operation || "venta";
  const tipo = selectedZone.tipoInmueble || "viviendas";

  if (selectedZone.type === "custom_polygon") {
    const polygonKey = selectedZone.polygonKey;
    return `/${op}-${tipo}/zona-personalizada?polyKey=${polygonKey}`;
  }

  let locationSlug;

  switch (selectedZone.type) {
    case "barrio": {
      const b = slugify(selectedZone.name);
      const m = slugify(selectedZone.mpioName || "");
      const dptoCode = selectedZone.mpioDaneCode?.slice(0, 2);
      const d = slugify(selectedZone.dptoName || deptNames[dptoCode] || "");
      locationSlug = [b, m, d].filter(Boolean).join("-");
      break;
    }
    case "municipio": {
      const m = slugify(selectedZone.name);
      const d = slugify(selectedZone.dptoName || deptNames[selectedZone.dptoDaneCode] || "");
      locationSlug = [m, d].filter(Boolean).join("-");
      break;
    }
    case "departamento":
    default:
      locationSlug = slugify(selectedZone.name);
      break;
  }

  return `/${op}-${tipo}/${locationSlug}`;
}
