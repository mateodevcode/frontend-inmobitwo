// data/colombia-data.js
export const departamentosCiudades = {
  Amazonas: ["Leticia", "Puerto Nariño"],
  Antioquia: ["Medellín", "Bello", "Itagüí", "Envigado", "Rionegro"],
  Atlántico: ["Barranquilla", "Soledad", "Malambo", "Sabanalarga"],
  Bogotá: ["Bogotá"],
  Bolívar: ["Cartagena", "Magangué", "Turbaco"],
  Boyacá: ["Tunja", "Sogamoso", "Duitama"],
  Caldas: ["Manizales", "La Dorada", "Chinchiná"],
  Caquetá: ["Florencia", "San Vicente del Caguán"],
  Casanare: ["Yopal", "Aguazul"],
  Cauca: ["Popayán", "Santander de Quilichao"],
  Cesar: ["Valledupar", "Aguachica"],
  Chocó: ["Quibdó", "Istmina"],
  Córdoba: ["Montería", "Cereté", "Sahagún"],
  Cundinamarca: ["Soacha", "Girardot", "Facatativá"],
  Guainía: ["Inírida"],
  Guaviare: ["San José del Guaviare"],
  Huila: ["Neiva", "Pitalito", "Garzón"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia"],
  Magdalena: ["Santa Marta", "Ciénaga", "Fundación"],
  Meta: ["Villavicencio", "Acacías", "Granada"],
  Nariño: ["Pasto", "Ipiales", "Tumaco"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona"],
  Putumayo: ["Mocoa", "Puerto Asís"],
  Quindío: ["Armenia", "Calarcá", "Montenegro"],
  Risaralda: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "San Andrés": ["San Andrés"],
  Santander: ["Bucaramanga", "Floridablanca", "Girón"],
  Sucre: ["Sincelejo", "Corozal", "Sampués"],
  Tolima: ["Ibagué", "Espinal", "Melgar"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
  Vaupés: ["Mitú"],
  Vichada: ["Puerto Carreño"],
};

export const tiposPropiedad = [
  "casa",
  "apartamento",
  "lote",
  "oficina",
  "local",
  "finca",
  "bodega",
  "consultorio",
  "casa campestre",
  "apartaestudio",
];

export const agentes = [
  { id: "68e82f8972bf2f4a1b73701e", nombre: "Carlos Rodríguez" },
  { id: "68e82f8972bf2f4a1b73701a", nombre: "María González" },
  { id: "68e82f8972bf2f4a1b73702e", nombre: "Juan Pérez" },
  { id: "68e82f8972bf2f4a1b73703e", nombre: "Ana Martínez" },
];

export const estadosPropiedad = [
  {
    value: "disponible",
    label: "🟢 Disponible",
    descripcion: "Propiedad disponible para venta o alquiler",
  },
  {
    value: "arrendado",
    label: "🔵 Arrendado",
    descripcion: "Propiedad actualmente arrendada",
  },
  {
    value: "vendido",
    label: "🟣 Vendido",
    descripcion: "Propiedad vendida",
  },
  {
    value: "reservado",
    label: "🟡 Reservado",
    descripcion: "Propiedad reservada con señal",
  },
  {
    value: "en_negociacion",
    label: "🟠 En negociación",
    descripcion: "En proceso de negociación con cliente",
  },
  {
    value: "no_disponible",
    label: "⚫ No disponible",
    descripcion: "Temporalmente no disponible",
  },
  {
    value: "en_construccion",
    label: "🔶 En construcción",
    descripcion: "Propiedad en construcción",
  },
  {
    value: "proximo_lanzamiento",
    label: "🚀 Próximo lanzamiento",
    descripcion: "Próximo a ser lanzado al mercado",
  },
];
