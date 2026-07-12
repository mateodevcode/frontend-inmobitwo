import { useNavigate } from "react-router-dom";
import HeaderInmobitwo from "@/components/publicar-anuncio/info-publicar/HeaderInmobitwo";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { SiteFooter } from "@/components/publicar-anuncio/info-publicar/SiteFooter";
import ModalHamburguesa from "@/components/modales/ModalHamburguesa";
import { useEffect, useState } from "react";
import useFavoritos from "@/hooks/useFavoritos";
import ListaFavoritos from "@/components/usuario/favoritos/ListaFavoritos"; // ← lo creamos después
import SinFavoritos from "@/components/usuario/favoritos/SinFavoritos"; // ← lo creamos después

const MisFavoritos = () => {
  const navigate = useNavigate();
  const { cargandoGlobal, favoritos } = useAppContext();

  const { cargarMisFavoritos, loading } = useFavoritos();

  // Cargar favoritos al montar la página
  useEffect(() => {
    cargarMisFavoritos();
  }, []);

  return (
    <div className="flex flex-col font-montserrat relative min-h-screen">
      <HeaderInmobitwo />

      <div className="flex items-center justify-between py-4 mx-auto w-11/12 md:w-10/12">
        <h3 className="text-2xl md:text-2xl font-bold text-black">
          Mis Favoritos
        </h3>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-black/80 transition active:scale-95 cursor-pointer select-none"
        >
          Ver más propiedades
        </button>
      </div>

      {loading || cargandoGlobal ? (
        <div className="flex justify-center items-center py-20 min-h-[70svh]">
          <p className="text-lg">Cargando tus favoritos...</p>
        </div>
      ) : favoritos.length === 0 ? (
        <SinFavoritos />
      ) : (
        <ListaFavoritos propiedades={favoritos} />
      )}

      <div className="mt-auto">
        <SiteFooter />
      </div>

      <style>{scrollbarStyles.default}</style>
      <ModalHamburguesa />
    </div>
  );
};

export default MisFavoritos;
