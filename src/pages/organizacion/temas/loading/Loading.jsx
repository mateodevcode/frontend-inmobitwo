/**
 * Loading
 *
 * Pantalla de carga con fondo blanco, logo arriba y un loader animado abajo.
 * El tipo de animación se elige con la prop `type`.
 *
 * Props:
 * - logo: string -> ruta de la imagen del logo (default: "/logo/logo-hor.png")
 * - type: "opcion1" | "opcion2" | "opcion3" | "opcion4" | "opcion5" (default: "opcion1")
 *
 * Uso:
 * <Loading logo="/logo/logo-hor.png" type="opcion2" />
 *
 * Nota: la opción 5 (barra de progreso) requiere el keyframe "loading" en
 * tailwind.config.js (ver abajo del archivo).
 */

const Loading = ({ logo = "/logo/logo.png", type = "opcion1" }) => {
  const renderLoader = () => {
    switch (type) {
      // Spinner clásico (borde girando)
      case "opcion1":
        return (
          <div className="w-12 h-12 border-4 border-black/10 border-t-rose-600 rounded-full animate-spin" />
        );

      // Puntos rebotando
      case "opcion2":
        return (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-3 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-3 h-3 bg-rose-600 rounded-full animate-bounce" />
          </div>
        );

      // Logo con pulso + spinner pequeño (el logo mismo hace de loader)
      case "opcion3":
        return (
          <div className="w-10 h-10 border-[3px] border-black/10 border-t-rose-600 rounded-full animate-spin" />
        );

      // Círculo "ping" (ondas expandiéndose)
      case "opcion4":
        return (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute w-full h-full bg-rose-600/30 rounded-full animate-ping" />
            <span className="relative w-4 h-4 bg-rose-600 rounded-full" />
          </div>
        );

      // Barra de progreso indeterminada
      case "opcion5":
        return (
          <div className="w-48 h-1.5 bg-black/10 rounded-full overflow-hidden relative">
            <div className="absolute h-full w-1/3 bg-rose-600 rounded-full animate-[loading_1.2s_ease-in-out_infinite]" />
          </div>
        );

      default:
        return (
          <div className="w-12 h-12 border-4 border-black/10 border-t-rose-600 rounded-full animate-spin" />
        );
    }
  };

  return (
    <div className="bg-white h-[50svh] w-full flex flex-col items-center justify-center gap-8 font-poppins">
      <div className={`w-14 ${type === "opcion3" ? "animate-pulse" : ""}`}>
        <img src={logo} alt="logo" className="h-full w-full object-contain" />
      </div>

      {renderLoader()}
    </div>
  );
};

export default Loading;

/**
 * Si usas "opcion5", agrega esto en tailwind.config.js:
 *
 * export default {
 *   theme: {
 *     extend: {
 *       keyframes: {
 *         loading: {
 *           "0%": { left: "-33%" },
 *           "100%": { left: "100%" },
 *         },
 *       },
 *     },
 *   },
 * };
 */
