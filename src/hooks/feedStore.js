// hooks/feedStore.js
//
// Store externo del FEED de propiedades (red social).
// Reemplaza el estado `propiedades/cursor/hasMore/loadingPropiedades` que vivía
// en AppContext. Al actualizarse, solo se re-renderizan los componentes que
// suscriben con `useFeed()` (Principal, Admin, MisAnuncios) y NO toda la app.
//
// Uso:
//   const { propiedades, loading, hasMore } = useFeed();

import { useSyncExternalStore } from "react";

let state = {
  propiedades: [],
  loading: true,
  cursor: null,
  hasMore: true,
  cargandoMas: false,
};
const listeners = new Set();

export const getFeedSnapshot = () => state;

export const subscribeFeed = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const setFeed = (partial) => {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
};

export const feedActions = {
  setLoading: (loading) => setFeed({ loading }),
  setCargandoMas: (cargandoMas) => setFeed({ cargandoMas }),
  setPropiedades: (fnOrArray) =>
    setFeed({
      propiedades:
        typeof fnOrArray === "function"
          ? fnOrArray(state.propiedades)
          : fnOrArray,
    }),
  setCursor: (cursor) => setFeed({ cursor }),
  setHasMore: (hasMore) => setFeed({ hasMore }),
  reset: () =>
    setFeed({
      propiedades: [],
      loading: true,
      cursor: null,
      hasMore: true,
      cargandoMas: false,
    }),
};

export const useFeed = () => useSyncExternalStore(subscribeFeed, getFeedSnapshot);

export default useFeed;
