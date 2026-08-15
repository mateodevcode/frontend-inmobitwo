// hooks/favoritosStore.js
//
// Store externo de FAVORITOS del usuario.
// Reemplaza `favoritos/setFavoritos` que vivía en AppContext: al hacer toggle,
// solo se re-renderizan los componentes que suscriben con `useFavoritosStore()`
// (tarjetas del feed, mapa, anuncio, foto-visor, mis-favoritos) y NO toda la app.
//
// Uso:
//   const favoritos = useFavoritosStore();

import { useSyncExternalStore } from "react";

let favoritos = [];
let loading = false;
const listeners = new Set();

export const getFavoritosSnapshot = () => favoritos;

export const subscribeFavoritos = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const setFavoritosStore = (array) => {
  favoritos = array ?? [];
  listeners.forEach((l) => l());
};

export const setFavoritosLoading = (value) => {
  loading = value;
  listeners.forEach((l) => l());
};

export const useFavoritosStore = () =>
  useSyncExternalStore(subscribeFavoritos, getFavoritosSnapshot);

// Snapshot separado (primitivo) para no re-renderizar a los consumidores de
// `favoritos` cuando solo cambia el estado de carga.
export const useFavoritosLoadingStore = () =>
  useSyncExternalStore(subscribeFavoritos, () => loading);

export default useFavoritosStore;
