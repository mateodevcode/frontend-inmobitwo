import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderInmobitwo from "@/pages/publicar-anuncio-info/components/HeaderInmobitwo";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { SiteFooter } from "@/pages/publicar-anuncio-info/components/SiteFooter";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";
import useFavoritos from "@/hooks/useFavoritos";
import ListaFavoritos from "@/components/usuario/favoritos/ListaFavoritos";
import SinFavoritos from "@/components/usuario/favoritos/SinFavoritos";
import Loading from "./organizacion/temas/loading/Loading";

const MisFavoritos = () => {
  const navigate = useNavigate();
  const { cargandoGlobal, favoritos } = useAppContext();
  const { cargarMisFavoritos } = useFavoritos();

  // Cargar favoritos al montar la página
  useEffect(() => {
    cargarMisFavoritos();
  }, []);

  return (
    <div className="flex flex-col font-montserrat relative min-h-screen">
      <HeaderInmobitwo />

      <div className="flex md:flex-row flex-col md:items-center justify-between py-4 mx-auto w-11/12 md:w-10/12">
        <h3 className="text-2xl font-bold text-black">Mis Favoritos</h3>
        <button
          onClick={() => navigate("/")}
          className="rounded-md bg-black px-6 py-3 md:py-2 text-base font-semibold text-white hover:bg-black/80 active:scale-[0.99] cursor-pointer select-none md:mt-0 mt-4 font-poppins"
        >
          Ver más propiedades
        </button>
      </div>

      {cargandoGlobal ? (
        <div className="flex justify-center items-center min-h-[30svh]">
          <Loading type="opcion2" />
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
