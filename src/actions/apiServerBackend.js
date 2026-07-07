// src/api/apiServerBackend.js

import { API_SECRET_KEY, URL_BACKEND } from "@/config/config.js";

export async function apiServerBackend(endpoint, metodo = "GET", datos = null) {
  try {
    const url = `${URL_BACKEND}${endpoint}`;

    const res = await fetch(url, {
      method: metodo,
      headers: {
        "x-api-key": "AIzaSyDzDBSRhIIbGdMrTImpZk5v-tBm65W-2dljhbfkdjs5415dmdld",
        "Content-Type": "application/json",
      },
      body: metodo !== "GET" && datos !== null ? JSON.stringify(datos) : null,
    });

    const data = await res.json();

    return {
      success: data.success ?? false,
      message: data.message,
      data: data.data,
      error: data.error,
      status: res.status,
    };
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
