// Catálogo de tipos de inmueble (única fuente de verdad para el wizard de publicación)

// Descripción corta por tipo (misma estructura que el catálogo del backend)
export const PROPERTY_TYPES_DESCRIPCIONES = {
  apartamento: "Vivienda en edificio",
  casa: "Vivienda unifamiliar",
  casa_campestre: "Casa con terreno campestre",
  apartaestudio: "Estudio de un solo ambiente",
  penthouse: "Apartamento en el último piso",
  casa_lote: "Casa con lote",
  local: "Espacio comercial",
  oficina: "Espacio para uso profesional",
  bodega: "Espacio de almacenamiento",
  consultorio: "Consultorio médico o profesional",
  edificio: "Edificio completo",
  lote: "Terreno sin construir",
  finca: "Finca rural o campestre",
  parqueadero: "Espacio de estacionamiento",
  trastero: "Depósito o almacenamiento",
  habitacion: "Habitación en vivienda compartida",
};

// Catálogo local (fallback). El backend devuelve { id, code, label_es },
// aquí se normaliza a { id, code, label, description }.
export const PROPERTY_TYPES_FALLBACK = [
  { id: 1, code: "apartamento", label: "Apartamento" },
  { id: 2, code: "casa", label: "Casa" },
  { id: 16, code: "habitacion", label: "Habitación" },
  { id: 3, code: "casa_campestre", label: "Casa campestre" },
  { id: 4, code: "apartaestudio", label: "Apartaestudio" },
  { id: 5, code: "penthouse", label: "Penthouse" },
  { id: 6, code: "casa_lote", label: "Casa lote" },
  { id: 7, code: "local", label: "Local comercial" },
  { id: 8, code: "oficina", label: "Oficina" },
  { id: 9, code: "bodega", label: "Bodega" },
  { id: 10, code: "consultorio", label: "Consultorio" },
  { id: 11, code: "edificio", label: "Edificio" },
  { id: 12, code: "lote", label: "Lote / Terreno" },
  { id: 13, code: "finca", label: "Finca" },
  { id: 14, code: "parqueadero", label: "Parqueadero" },
  { id: 15, code: "trastero", label: "Trastero" },
].map((t) => ({
  ...t,
  description: PROPERTY_TYPES_DESCRIPCIONES[t.code],
}));

const INDICE_ORDEN = new Map(
  PROPERTY_TYPES_FALLBACK.map((t, i) => [t.code, i]),
);

export function ordenarPropertyTypes(lista) {
  return [...lista].sort(
    (a, b) => (INDICE_ORDEN.get(a.code) ?? 999) - (INDICE_ORDEN.get(b.code) ?? 999),
  );
}
