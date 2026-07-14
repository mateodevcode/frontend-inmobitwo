// src/pages/organizacion/temas/temaRegistry.js
import * as tema1 from "./tema1";
import * as tema2 from "./tema2";
import * as tema3 from "./tema3";
import * as tema4 from "./tema4";

export const TEMAS = {
  tema1: {
    id: "tema1",
    nombre: "Clásico",
    thumbnail: "/temas/tema1-thumb.jpg", // agregá la imagen cuando la tengas
    Layout: tema1.Layout,
    Home: tema1.Home,
    SobreNosotros: tema1.SobreNosotros,
    Contacto: tema1.Contacto,
  },
  tema2: {
    id: "tema2",
    nombre: "Moderno",
    thumbnail: "/temas/tema2-thumb.jpg",
    Layout: tema2.Layout,
    Home: tema2.Home,
    SobreNosotros: tema2.SobreNosotros,
    Contacto: tema2.Contacto,
  },
  tema3: {
    id: "tema3",
    nombre: "Con mapa",
    thumbnail: "/temas/tema3-thumb.jpg",
    Layout: tema3.Layout,
    Home: tema3.Home,
    SobreNosotros: tema3.SobreNosotros,
    Contacto: tema3.Contacto,
  },
  tema4: {
    id: "tema4",
    nombre: "Minimalista",
    thumbnail: "/temas/tema4-thumb.jpg",
    Layout: tema4.Layout,
    Home: tema4.Home,
    SobreNosotros: tema4.SobreNosotros,
    Contacto: tema4.Contacto,
  },
};

export const TEMA_DEFAULT = "tema1";

export const getTema = (id) => TEMAS[id] || TEMAS[TEMA_DEFAULT];
