// src/api/apiBackendFormData.js
import { URL_BACKEND } from "@/config/config.js";

export async function apiBackendFormData(endpoint, formData, method = "POST") {
  try {
    const url = `${URL_BACKEND}${endpoint}`;
    const token = localStorage.getItem("access_token");

    const res = await fetch(url, {
      method,
      headers: {
        // ❌ Sin Content-Type — el navegador lo pone solo con el boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: formData,
    });

    // Token expirado → renovar y reintentar
    if (res.status === 401 && token) {
      const renovado = await renovarToken();
      if (renovado) {
        const nuevoToken = localStorage.getItem("access_token");
        const reintento = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${nuevoToken}`,
          },
          credentials: "include",
          body: formData,
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
async function renovarToken() {
  try {
    const res = await fetch(`${URL_BACKEND}/auth/refresh`, {
      method: "POST",
      credentials: "include",
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
function formatearRespuesta(data, status) {
  return {
    success: data.success ?? false,
    message: data.message ?? null,
    data: data.data ?? null,
    error: data.error ?? null,
    status,
  };
}
