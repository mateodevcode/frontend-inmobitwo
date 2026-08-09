// Catálogo de características → columnas rápidas de la tabla propiedades.
// Única fuente de verdad para el filtro "Características" del sidebar.
export const CARACTERISTICAS_INMUEBLE = [
  { id: "ascensor", label: "Ascensor", columna: "has_elevator" },
  { id: "piscina", label: "Piscina", columna: "has_swimming_pool" },
  { id: "gimnasio", label: "Gimnasio", columna: "has_gym" },
  {
    id: "seguridad_24h",
    label: "Seguridad 24 horas",
    columna: "has_security_24h",
  },
  {
    id: "aire_acondicionado",
    label: "Aire acondicionado",
    columna: "has_air_conditioning",
  },
  { id: "amoblado", label: "Amoblado / Equipado", columna: "is_furnished" },
  { id: "parqueadero", label: "Parqueadero", columna: "parking_space_count" },
];
