export function toCapitalize(fullName) {
  if (!fullName || typeof fullName !== "string") return "";

  return fullName
    .trim() // Quita espacios al inicio y final
    .split(/\s+/) // Divide por uno o más espacios
    .map((word) => {
      if (word.length === 0) return word;

      // Convierte cada palabra a Camel Case (Title Case)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" "); // Une todo de nuevo con espacio
}
