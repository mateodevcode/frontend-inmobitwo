import { useNavigate } from "react-router-dom";
import { TiHeartOutline } from "react-icons/ti";

const SinFavoritos = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-7xl mb-6 text-stone-300">
        <TiHeartOutline />
      </div>

      <h2 className="text-2xl font-bold text-black mb-3">
        Aún no tienes favoritos
      </h2>
      <p className="text-stone-600 max-w-md">
        Cuando veas una propiedad que te guste, guarda en favoritos para
        revisarla más tarde.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-black/80 transition active:scale-95 cursor-pointer select-none"
      >
        Explorar propiedades
      </button>
    </div>
  );
};

export default SinFavoritos;
