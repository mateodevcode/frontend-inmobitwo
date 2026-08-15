# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# frontend-inmobitwo

## Estándar de Loaders (obligatorio para cualquier implementación)

Cada vez que se agregue o modifique un flujo con carga de datos, seguir estas reglas. Si no, se genera el bug de "doble loader" y parpadeo del overlay global.

### Regla principal: cargas de página usan loader LOCAL, no el overlay global

- Las **cargas de datos de una página/vista** (feed, mis-anuncios, favoritos, búsqueda, detalle) NO deben llamar a `iniciarCarga()`/`terminarCarga()`.
- Cada página muestra su propio loader local:
  - `<SmartLoader delay={300} />` (spinner inteligente: solo aparece si tarda >delay) para listas/búsquedas.
  - `<Loading type="opcion2" />` para estados locales propios de una página.
- El **estado local de carga** viene de un store externo, no de `cargandoGlobal`:
  - Feed: `useFeed().loading` (y `cargandoMas` para el botón "Ver más").
  - Favoritos: `useFavoritosLoadingStore()`.

### LoaderGlobal (overlay full-screen)

- Se usa SOLO para **mutaciones / acciones pesadas** que requieren bloquear la UI (crear/editar/eliminar anuncio, cambiar password, guardar contacto, etc.).
- Tiene `delay = 250ms` integrado: no aparece en operaciones rápidas. No volver a quitar ese delay.
- Si una función de "carga de página" llama `iniciarCarga()`, es un bug: mover ese estado a un loader local/store.

### Reglas de caché para evitar cargas repetidas

- Datos **estáticos** (catálogos, geo, barrios): `usePreloadData` / `fetchStaticJson` (`src/hooks/staticCache.js`). Nunca fetch on-demand.
- Datos dinámicos repetidos: caché a nivel de módulo keyed por id/combo (ver `useDetalles.js`, `propiedadCache` en `usePropiedades.js`).
- `cargarCountMisAnuncios`: tiene caché por usuario (TTL 30s). No cambiar a fetch sin caché.

### Checklist al implementar cualquier loader

1. ¿Es carga de página? → loader local (SmartLoader o store), NUNCA `iniciarCarga()`.
2. ¿Es mutación pesada? → `iniciarCarga()`/`terminarCarga()` (dispara LoaderGlobal con delay).
3. ¿El estado de carga viene de `cargandoGlobal` en una página? → reemplazarlo por el loader local del store.
4. ¿Hay datos estáticos pidiéndose on-demand? → precarga/caché.
5. Referencia completa de patrones: ver `README_OPTIMIZACION.md`.

