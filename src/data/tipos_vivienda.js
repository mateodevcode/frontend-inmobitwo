// Categorías agrupadas de vivienda → códigos de property_types
export const CATEGORIAS_VIVIENDA = [
  {
    id: "apartamentos",
    label: "Apartamentos",
    tipos: "apartamento,apartaestudio,penthouse",
  },
  {
    id: "casas",
    label: "Casas",
    tipos: "casa,casa_lote,casa_campestre",
  },
  { id: "edificios", label: "Edificios", tipos: "edificio" },
  {
    id: "habitaciones",
    label: "Habitaciones",
    tipos: "habitacion",
    soloAlquiler: true,
  },
  { id: "fincas", label: "Fincas", tipos: "finca" },
  { id: "lotes", label: "Lotes / Terrenos", tipos: "lote" },
  {
    id: "locales-oficinas",
    label: "Locales y Oficinas",
    tipos: "local,oficina,consultorio,bodega",
  },
];
