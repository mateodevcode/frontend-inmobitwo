import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { FaPlus } from "react-icons/fa6";
import { filtros_propiedades } from "@/data/filtros_propiedades";
import CardPropiedad from "./CardPropiedad";
import { useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoStatsChartOutline } from "react-icons/io5";
import usePropiedades from "@/hooks/usePropiedades";
import { useRef } from "react";
import InputSearchPrincipal from "./InputSearchPrincipal";
import useFavoritos from "../../hooks/useFavoritos";

const Principal = () => {
  const {
    propiedades,
    loadingPropiedades,
    setOpenModalActividades,
    search,
    setSearch,
    setOpenModalSidebar,
    cargandoGlobal,
    hasMore,
  } = useAppContext();
  const { cargarPropiedades } = usePropiedades();
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todo");
  const [mostrarBotonCargar, setMostrarBotonCargar] = useState(false);
  const navigate = useNavigate();
  const cargaInicialHecha = useRef(false); // 👈 nuevo
  const ultimaCardRef = useRef(null);
  const { cargarMisFavoritos } = useFavoritos();

  const propiedades_publicadas = propiedades?.filter(
    (pro) => pro.estado === "publicado",
  );

  useEffect(() => {
    if (cargaInicialHecha.current) return; // 👈 nuevo
    cargaInicialHecha.current = true; // 👈 nuevo
    cargarPropiedades();
    cargarMisFavoritos();
  }, []);

  // 👇 Observer que detecta cuándo la última card entra en pantalla
  useEffect(() => {
    if (!ultimaCardRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        setMostrarBotonCargar(entrada.isIntersecting);
      },
      {
        root: null, // viewport del navegador
        threshold: 0.3, // se activa cuando el 30% de la card es visible
      },
    );

    observer.observe(ultimaCardRef.current);

    return () => observer.disconnect(); // limpieza al desmontar o al cambiar la lista
  }, [propiedades_publicadas.length, hasMore]);

  const handleCargarMas = () => {
    cargarPropiedades();
  };

  return (
    <main className="w-11/12 md:w-150 md:px-6 pb-10 pt-4 mx-auto relative">
      {/* Barra top */}
      <div className="flex items-center justify-between gap-3">
        {/* Boton Menu */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            className="bg-white text-black w-10 h-10 rounded-md cursor-pointer select-none active:scale-95 duration-75 transition border border-black/20 flex items-center justify-center"
            onClick={() => setOpenModalSidebar(true)}
          >
            <LuMenu className="text-xl" />
          </button>
          <button
            className="bg-white text-black w-10 h-10 rounded-md cursor-pointer select-none active:scale-95 duration-75 transition border border-black/20 flex items-center justify-center"
            onClick={() => setOpenModalActividades(true)}
          >
            <IoStatsChartOutline className="text-xl" />
          </button>
        </div>

        <InputSearchPrincipal search={search} setSearch={setSearch} />
        {/* Boton publicar */}
        <button
          className="flex items-center justify-center gap-2 bg-black hover:bg-black/80 rounded-lg px-3 py-2 text-white cursor-pointer select-none active:scale-95 duration-75 transition"
          type="button"
          // onClick={() => setOpenModalAgregarPropiedad(true)}
          onClick={() => {
            navigate("/info/publicar-anuncio");
            window.scrollTo(0, 0);
          }}
        >
          <FaPlus className="text-sm" />
          <span className="font-medium text-sm">Publicar</span>
        </button>
      </div>

      {/* filtro */}
      <div className="flex items-center gap-2 my-4 flex-wrap">
        {filtros_propiedades.map((fil, i) => {
          return (
            <button
              className={`text-sm font-semibold rounded-full px-3 py-1 cursor-pointer select-none active:scale-95 duration-75 transition ${filtroSeleccionado === fil.label ? "bg-black border border-white/20 text-white" : "bg-white border border-black/20 text-black"}`}
              onClick={() => setFiltroSeleccionado(fil.label)}
              key={i}
            >
              {fil.name}
            </button>
          );
        })}
      </div>

      {/* Propiedades */}

      {loadingPropiedades ? (
        <div className="text-center py-20 text-gray-400 min-h-96 flex items-center justify-center">
          Cargando propiedades...
        </div>
      ) : propiedades.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No hay propiedades disponibles aún.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {propiedades_publicadas.map((pro, i) => {
            const esLaUltima = i === propiedades_publicadas.length - 1;
            return (
              <CardPropiedad
                propiedades={pro}
                ultimaCardRef={ultimaCardRef}
                esLaUltima={esLaUltima}
                key={pro?.id}
              />
            );
          })}
        </div>
      )}

      {/* 👇 Botón flotante para cargar más */}
      {mostrarBotonCargar && hasMore && (
        <button
          onClick={handleCargarMas}
          disabled={cargandoGlobal}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-black/80 active:scale-95 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargandoGlobal ? "Cargando..." : "Ver más"}
        </button>
      )}
    </main>
  );
};

export default Principal;
