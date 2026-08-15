// src/pages/publicar-anuncio/anuncioProgreso.js
//
// Progreso del wizard de publicación. Centraliza el estado en localStorage:
//   - "ultimoAnuncioId": { id, step, timestamp }
//       id   → id de la propiedad ya creada (null mientras no exista)
//       step → paso del wizard (1 = datos básicos, 2 = detalles, 3 = fotos)
//   - "publicarAnuncioForm": snapshot JSON de formDataPropiedad (pasos 1 y 2)
//
// Compatible con datos antiguos: si "ultimoAnuncioId" no tiene "step" pero sí
// id, se asume que el usuario estaba en el paso 3.

const CLAVE_PROGRESO = "ultimoAnuncioId";
const CLAVE_FORM = "publicarAnuncioForm";

export const PASO_DATOS_BASICOS = 1;
export const PASO_DETALLES = 2;
export const PASO_FOTOS = 3;

export function leerProgreso() {
  try {
    const crudo = localStorage.getItem(CLAVE_PROGRESO);
    if (!crudo) return null;
    const parsed = JSON.parse(crudo);
    if (!parsed || typeof parsed !== "object") return null;
    const id = parsed.id ?? null;
    const step =
      parsed.step ?? (id ? PASO_FOTOS : PASO_DATOS_BASICOS);
    return { id, step, timestamp: parsed.timestamp ?? null };
  } catch {
    return null;
  }
}

export function guardarProgreso({ id = null, step = PASO_DATOS_BASICOS } = {}) {
  localStorage.setItem(
    CLAVE_PROGRESO,
    JSON.stringify({
      id: id ?? null,
      step,
      timestamp: new Date().toISOString(),
    }),
  );
}

export function actualizarPaso(step) {
  const prev = leerProgreso();
  guardarProgreso({ id: prev?.id ?? null, step });
}

export function limpiarProgreso() {
  localStorage.removeItem(CLAVE_PROGRESO);
}

export function guardarSnapshot(formData) {
  try {
    localStorage.setItem(CLAVE_FORM, JSON.stringify(formData));
  } catch {
    // Silencioso: el snapshot es un extra, no debe romper el flujo.
  }
}

export function leerSnapshot() {
  try {
    const crudo = localStorage.getItem(CLAVE_FORM);
    if (!crudo) return null;
    return JSON.parse(crudo);
  } catch {
    return null;
  }
}

export function limpiarSnapshot() {
  localStorage.removeItem(CLAVE_FORM);
}

export function limpiarTodo() {
  limpiarProgreso();
  limpiarSnapshot();
}
