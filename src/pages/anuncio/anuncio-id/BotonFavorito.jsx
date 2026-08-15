import { useParams } from "react-router-dom";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import useFavoritos from "@/hooks/useFavoritos";
import { useFavoritosStore } from "@/hooks/favoritosStore";

const BotonFavorito = () => {
  const { id } = useParams();
  const favoritos = useFavoritosStore();
  const { handleFavorito, estaEnFavoritos } = useFavoritos();
  const isFavorited = estaEnFavoritos(favoritos, id);

  return (
    <button
      type="button"
      onClick={(e) => handleFavorito(e, id)}
      className={`flex items-center justify-center gap-2 border rounded-md px-4 py-1.5 font-semibold cursor-pointer select-none active:scale-95 duration-75 transition text-xs w-min ${
        isFavorited
          ? "bg-red-50 border-red-500 text-red-600"
          : "bg-white border-black/20 text-black hover:bg-black/5"
      }`}
    >
      {isFavorited ? (
        <TiHeartFullOutline className="text-base" />
      ) : (
        <TiHeartOutline className="text-base" />
      )}
      <span>{isFavorited ? "Favorito" : "Guardar"}</span>
    </button>
  );
};

export default BotonFavorito;
