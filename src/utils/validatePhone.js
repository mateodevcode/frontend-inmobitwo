// utils/validatePhone.js
// Validación de teléfonos móviles de Colombia (por ahora solo CO).

// Deja solo dígitos. Devuelve "" si no tiene dígitos.
export function limpiarTelefono(telefono) {
  return String(telefono ?? "").replace(/[^\d]/g, "");
}

// Normaliza a número local de Colombia: quita el prefijo "57" si el número
// viene en formato internacional (+57...) de 12 dígitos.
export function normalizarTelefonoColombia(telefono) {
  let limpio = limpiarTelefono(telefono);
  if (limpio.startsWith("57") && limpio.length === 12) {
    limpio = limpio.slice(2);
  }
  return limpio;
}

// Móvil colombiano válido: 10 dígitos y empieza por 3 (ej: 3001234567).
export function validarTelefonoColombia(telefono) {
  const limpio = normalizarTelefonoColombia(telefono);
  if (limpio.length !== 10) return false;
  if (!limpio.startsWith("3")) return false;
  return true;
}

// Filtra una lista dejando solo teléfonos válidos (normalizados a 10 dígitos).
export function filtrarTelefonosValidosColombia(telefonos) {
  return (telefonos ?? [])
    .map(normalizarTelefonoColombia)
    .filter(validarTelefonoColombia);
}
