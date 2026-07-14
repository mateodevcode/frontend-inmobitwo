// utils/validatePassword.js

export function validatePasswordNueva(passwordActual, passwordNueva) {
  const errores = [];

  if (!passwordActual) {
    errores.push("La contraseña actual es requerida.");
  }

  if (!passwordNueva) {
    errores.push("La nueva contraseña es requerida.");
    return errores;
  }

  if (passwordNueva.length < 8) {
    errores.push("Debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(passwordNueva)) {
    errores.push("Debe incluir al menos una mayúscula.");
  }
  if (!/[a-z]/.test(passwordNueva)) {
    errores.push("Debe incluir al menos una minúscula.");
  }
  if (!/[0-9]/.test(passwordNueva)) {
    errores.push("Debe incluir al menos un número.");
  }
  if (!/[^A-Za-z0-9]/.test(passwordNueva)) {
    errores.push("Debe incluir al menos un carácter especial.");
  }
  if (passwordActual === passwordNueva) {
    errores.push("La nueva contraseña debe ser distinta a la actual.");
  }

  return errores;
}

export function validatePasswordRegistro(password) {
  const errores = [];

  if (!password) {
    errores.push("La contraseña es requerida.");
    return errores;
  }

  if (password.length < 8) {
    errores.push("Debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
    errores.push("Debe incluir al menos una mayúscula.");
  }
  if (!/[a-z]/.test(password)) {
    errores.push("Debe incluir al menos una minúscula.");
  }
  if (!/[0-9]/.test(password)) {
    errores.push("Debe incluir al menos un número.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errores.push("Debe incluir al menos un carácter especial.");
  }

  return errores;
}

export function getPasswordChecklist(passwordNueva) {
  return {
    longitud: passwordNueva.length >= 8,
    mayuscula: /[A-Z]/.test(passwordNueva),
    minuscula: /[a-z]/.test(passwordNueva),
    numero: /[0-9]/.test(passwordNueva),
    especial: /[^A-Za-z0-9]/.test(passwordNueva),
  };
}
