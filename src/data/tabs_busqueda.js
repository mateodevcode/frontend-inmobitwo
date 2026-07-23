export const TAB_COMPRAR = {
  nombre: "Comprar",
  id: "comprar",
  urlSegment: "venta-viviendas",
};

export const TAB_ALQUILAR = {
  nombre: "Alquilar",
  id: "alquilar",
  urlSegment: "arriendo-viviendas",
};

export const TAB_VACACIONAL = {
  nombre: "Vacacional",
  id: "vacacional",
  urlSegment: "arriendo-vacacional",
};

export const TAB_OBRA_NUEVA = {
  nombre: "Obra nueva",
  id: "obra-nueva",
  urlSegment: "venta-obra-nueva",
};

export function getSelectedId(operationSlug, typeSlug) {
  if (typeSlug === "vacacional") return "vacacional";
  if (typeSlug === "obra-nueva") return "obra-nueva";
  if (operationSlug === "arriendo") return "alquilar";
  return "comprar";
}

export function getTabs(operationSlug) {
  return [
    TAB_COMPRAR,
    TAB_ALQUILAR,
    operationSlug === "arriendo" ? TAB_VACACIONAL : TAB_OBRA_NUEVA,
  ];
}
