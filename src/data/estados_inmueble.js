// Catálogo de estado de conservación agrupado → códigos de condition_types.
// Única fuente de verdad para el filtro "Estado" del sidebar.
export const ESTADOS_INMUEBLE = [
  {
    id: "obra_nueva",
    label: "Obra nueva",
    codigos: [
      "nuevo",
      "para_estrenar",
      "en_construccion",
      "obra_negra",
      "obra_gris",
    ],
  },
  { id: "usado", label: "Usado", codigos: ["usado"] },
  { id: "remodelado", label: "Remodelado", codigos: ["remodelado"] },
  { id: "para_remodelar", label: "Para remodelar", codigos: ["para_remodelar"] },
];
