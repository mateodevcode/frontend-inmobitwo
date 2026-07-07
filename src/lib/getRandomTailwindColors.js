function getRandomColor() {
  const colors = [
    { bg: "bg-purple-300", text: "text-purple-900" },
    { bg: "bg-blue-300", text: "text-blue-900" },
    { bg: "bg-green-300", text: "text-green-900" },
    { bg: "bg-red-300", text: "text-red-900" },
    { bg: "bg-yellow-300", text: "text-yellow-900" },
    { bg: "bg-pink-300", text: "text-pink-900" },
    { bg: "bg-indigo-300", text: "text-indigo-900" },
    { bg: "bg-teal-300", text: "text-teal-900" },
    { bg: "bg-orange-300", text: "text-orange-900" },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// En tu componente - mezclar y asignar colores aleatorios
const colorMap = new Map();

// Función para obtener color aleatorio para cada organización
export function getColorForOrg(id) {
  if (!colorMap.has(id)) {
    colorMap.set(id, getRandomColor());
  }
  return colorMap.get(id);
}
