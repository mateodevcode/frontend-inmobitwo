import { useNavigate } from "react-router-dom";
import HeaderInmobitwo from "@/pages/publicar-anuncio-info/components/HeaderInmobitwo";
import ListaAnuncios from "@/components/usuario/tus-anuncios/ListaAnuncios";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { SiteFooter } from "@/pages/publicar-anuncio-info/components/SiteFooter";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";
import SinAnuncios from "@/components/usuario/tus-anuncios/SinAnuncios";
import { useEffect } from "react";
import usePropiedades from "../hooks/usePropiedades";
import { irArriba } from "@/utils/irArriba";
import Loading from "./organizacion/temas/loading/Loading";

const MisAnuncios = () => {
  const navigate = useNavigate();
  const { propiedades, cargandoGlobal, usuario } = useAppContext();
  const { cargarPropiedadesMisAnuncios } = usePropiedades();

  const mis_propiedades = propiedades?.filter(
    (pro) => pro.publicado_por_id === usuario?.id,
  );

  useEffect(() => {
    cargarPropiedadesMisAnuncios();
  }, []);

  return (
    <div className="flex flex-col font-montserrat relative">
      <HeaderInmobitwo />
      <div className="flex md:flex-row flex-col md:items-center justify-between py-4 mx-auto w-11/12 md:w-10/12">
        <h3 className="text-2xl font-bold text-black">Mis anuncios</h3>
        <button
          type="button"
          onClick={() => {
            document.getElementById("top-detalles")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            navigate("/info/publicar-anuncio");
          }}
          className="rounded-md bg-rose-600 px-6 py-3 md:py-2 text-base md:text-lg font-semibold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none md:mt-0 mt-4 font-poppins"
        >
          {mis_propiedades.length === 0
            ? "Pon un anuncio"
            : "Poner otro anuncio"}
        </button>
      </div>

      {cargandoGlobal ? (
        <div className="flex justify-center items-center min-h-[30svh]">
          <Loading type="opcion2" />
        </div>
      ) : mis_propiedades.length === 0 ? (
        <SinAnuncios />
      ) : (
        <ListaAnuncios propiedades={mis_propiedades} />
      )}

      {cargandoGlobal ? null : (
        <div className="w-full flex items-center justify-center my-10 md:px-0 px-4">
          <button
            type="button"
            onClick={() => {
              document.getElementById("top-detalles")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              navigate("/info/publicar-anuncio");
              irArriba();
            }}
            className="font-poppins rounded-md bg-rose-600 px-6 py-3 md:py-2 text-base md:text-lg font-semibold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none w-full md:w-64"
          >
            {mis_propiedades.length === 0
              ? "Pon un anuncio"
              : "Poner otro anuncio"}
          </button>
        </div>
      )}

      <SiteFooter />

      <style>{scrollbarStyles.default}</style>

      <ModalHamburguesa />
    </div>
  );
};

export default MisAnuncios;
