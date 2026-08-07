export const RENTAL_TYPE_OPTIONS = [
  {
    id: 1,
    code: "residencial",
    label: "Residencial, vivienda habitual",
  },
  {
    id: 2,
    code: "temporada",
    label:
      "De temporada, por periodos limitados, por ejemplo, lectivos, trabajo temporal, mudanzas, etc.",
  },
  {
    id: 3,
    code: "vacacional",
    label: "Vacacional, para estancias turísticas",
  },
];

export const RENTAL_TYPE_IDS = Object.fromEntries(
  RENTAL_TYPE_OPTIONS.map((o) => [o.code, o.id]),
);
