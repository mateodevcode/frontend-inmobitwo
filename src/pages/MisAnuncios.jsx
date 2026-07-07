import { useNavigate } from "react-router-dom";
import HeaderInmobitwo from "@/components/publicar-anuncio/info-publicar/HeaderInmobitwo";
import ListaAnuncios from "@/components/usuario/tus-anuncios/ListaAnuncios";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { SiteFooter } from "@/components/publicar-anuncio/info-publicar/SiteFooter";
import ModalHamburguesa from "@/components/modales/ModalHamburguesa";
import SinAnuncios from "@/components/usuario/tus-anuncios/SinAnuncios";

const MisAnuncios = () => {
  const navigate = useNavigate();
  const { propiedades, cargandoGlobal, usuario } = useAppContext();

  const mis_propiedades = propiedades?.filter(
    (pro) => pro.publicado_por_id === usuario?.id,
  );

  return (
    <div className="flex flex-col font-montserrat relative">
      <HeaderInmobitwo />
      <div className="flex items-center justify-between py-4 mx-auto w-11/12 md:w-10/12">
        <h3 className="text-2xl md:text-2xl font-bold text-black">
          Mis anuncios
        </h3>
        <button
          type="button"
          onClick={() => {
            document.getElementById("top-detalles")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            navigate("/info/publicar-anuncio");
          }}
          className="rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
        >
          {mis_propiedades.length === 0
            ? "Pon un anuncio"
            : "Poner otro anuncio"}
        </button>
      </div>

      {mis_propiedades.length === 0 ? (
        <SinAnuncios />
      ) : (
        <ListaAnuncios propiedades={mis_propiedades} />
      )}

      {cargandoGlobal ? null : (
        <div className="w-full flex items-center justify-center my-10">
          <button
            type="button"
            onClick={() => {
              document.getElementById("top-detalles")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              navigate("/info/publicar-anuncio");
              window.scrollTo(0, 0);
            }}
            className="rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none"
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
