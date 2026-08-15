import { toast } from "sonner";
import { apiBackend } from "@/api/apiBackend.js";
import {
  setFavoritosLoading,
  setFavoritosStore,
} from "@/hooks/favoritosStore";
import useTracking from "./useTracking";

const useFavoritos = () => {
  const { dispararEventoYRevisar } = useTracking();

  // ─────────────────────────────────────────────
  // Toggle favorito (agregar o quitar)
  // ─────────────────────────────────────────────
  const toggleFavorito = async (propiedadId) => {
    if (!propiedadId) {
      toast.error("ID de propiedad no válido");
      return { success: false };
    }

    try {
      const res = await apiBackend("/favoritos/toggle", "POST", {
        propiedadId,
      });

      if (res.success) {
        cargarMisFavoritos();
      } else {
        toast.error(
          res.error || res.message || "Error al actualizar favorito",
          {
            position: "bottom-right",
          },
        );
      }

      return res;
    } catch (error) {
      console.error("Error toggle favorito:", error);
      toast.error("Error al actualizar favoritos");
      return { success: false };
    }
  };

  // ─────────────────────────────────────────────
  // Obtener todos los favoritos del usuario
  // ─────────────────────────────────────────────

  const cargarMisFavoritos = async () => {
    setFavoritosLoading(true);
    try {
      const url = `/favoritos/mis-favoritos`;

      const res = await apiBackend(url);

      if (res.success) {
        setFavoritosStore(res.data);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      setFavoritosLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Verificar si una propiedad está en favoritos
  // (útil para pintar el botón de corazón lleno o vacío)
  // ─────────────────────────────────────────────
  const estaEnFavoritos = (favoritos, propiedadId) => {
    if (!favoritos || !Array.isArray(favoritos)) return false;
    return favoritos.some((fav) => String(fav.id) === String(propiedadId));
  };

  // ─────────────────────────────────────────────
  // Manejar evento
  // ─────────────────────────────────────────────
  const handleFavorito = async (e, id) => {
    e.stopPropagation();
    const res = await toggleFavorito(id);
    if (res.success && res.data?.action === "agregado") {
      dispararEventoYRevisar(id, "favorito_agregado");
    }
  };

  return {
    toggleFavorito,
    cargarMisFavoritos,
    estaEnFavoritos,
    handleFavorito,
  };
};

export default useFavoritos;
