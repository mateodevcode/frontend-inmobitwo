// src/api/apiBackend.js
// Equivalente al apiServerBackend.js de Next.js
// Centraliza todas las peticiones al backend con el mismo formato de respuesta

const URL_BACKEND = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiBackend(endpoint, metodo = "GET", datos = null) {
  try {
    const url = `${URL_BACKEND}${endpoint}`;

    // Leer access token del localStorage
    const token = localStorage.getItem("access_token");

    const res = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include", // ← necesario para enviar/recibir cookies (refresh_token)
      body: metodo !== "GET" && datos !== null ? JSON.stringify(datos) : null,
    });

    // Si el access_token expiró, intentar renovarlo automáticamente
    if (res.status === 401 && token) {
      const renovado = await renovarToken();
      if (renovado) {
        const nuevoToken = localStorage.getItem("access_token");
        const reintento = await fetch(url, {
          method: metodo,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nuevoToken}`,
          },
          credentials: "include",
          body:
            metodo !== "GET" && datos !== null ? JSON.stringify(datos) : null,
        });

        const data = await reintento.json();
        return formatearRespuesta(data, reintento.status);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
        return { success: false, error: "Sesión expirada.", data: null };
      }
    }

    const data = await res.json();
    return formatearRespuesta(data, res.status);
  } catch (error) {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      error: error.message,
      data: null,
      status: 500,
    };
  }
}

// ─────────────────────────────────────────────
// Renueva el access_token usando el refresh_token (cookie httpOnly)
// ─────────────────────────────────────────────
async function renovarToken() {
  try {
    const URL_BACKEND = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const res = await fetch(`${URL_BACKEND}/auth/refresh`, {
      method: "POST",
      credentials: "include", // envía la cookie httpOnly automáticamente
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      localStorage.setItem("access_token", data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Normaliza la respuesta siempre al mismo formato
// ─────────────────────────────────────────────
function formatearRespuesta(data, status) {
  return {
    success: data.success ?? false,
    message: data.message ?? null,
    data: data.data ?? null,
    error: data.error ?? null,
    status,
  };
}
