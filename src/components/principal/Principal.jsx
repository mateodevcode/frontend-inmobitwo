import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import CardPropiedad from "./card-propiedad/CardPropiedad";
import usePropiedades from "@/hooks/usePropiedades";
import { useRef } from "react";
import useFavoritos from "@/hooks/useFavoritos";
import HeaderPrincipal from "./header-principal/HeaderPrincipal";
import HeaderFiltros from "./header-principal/HeaderFiltros";

const Principal = () => {
  const {
    propiedades,
    loadingPropiedades,
    search,
    cargandoGlobal,
    hasMore,
    filtroSeleccionado,
  } = useAppContext();
  const { cargarPropiedades } = usePropiedades();
  const [mostrarBotonCargar, setMostrarBotonCargar] = useState(false);
  const cargaInicialHecha = useRef(false); // 👈 nuevo
  const ultimaCardRef = useRef(null);
  const { cargarMisFavoritos } = useFavoritos();

  const propiedades_publicadas = propiedades
    ?.filter((pro) => pro.estado === "publicado")
    .filter((pro) => {
      if (filtroSeleccionado === "todo" || filtroSeleccionado === "mas_filtros")
        return true;
      if (filtroSeleccionado === "venta") return pro.operacion_slug === "venta";
      if (filtroSeleccionado === "alquiler")
        return pro.operacion_slug === "arriendo";
      if (filtroSeleccionado === "pisos")
        return (
          pro.tipo_slug === "apartamento" ||
          pro.tipo_slug === "apartaestudio" ||
          pro.tipo_slug === "penthouse"
        );
      if (filtroSeleccionado === "casas") return pro.tipo_slug === "casa";
      if (filtroSeleccionado === "comercial")
        return (
          pro.tipo_slug === "local" ||
          pro.tipo_slug === "oficina" ||
          pro.tipo_slug === "bodega"
        );
      return true;
    })
    .filter((pro) => {
      if (!search) return true;

      const term = search.toLowerCase().trim();

      return (
        pro.titulo?.toLowerCase().includes(term) ||
        pro.tipo_inmueble?.toLowerCase().includes(term) ||
        pro.direccion?.toLowerCase().includes(term) ||
        pro.ciudad?.toLowerCase().includes(term) ||
        pro.barrio?.toLowerCase().includes(term)
      );
    });

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

  return (
    <main className="w-11/12 md:w-180 md:px-16 pb-10 pt-4 mx-auto relative">
      <HeaderPrincipal />

      <HeaderFiltros />

      {loadingPropiedades ? (
        <div className="text-center py-20 text-gray-400 min-h-96 flex items-center justify-center">
          Cargando propiedades...
        </div>
      ) : propiedades.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No hay propiedades disponibles aún.
        </div>
      ) : propiedades_publicadas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No se encontraron propiedades con esos filtros.
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
          onClick={() => cargarPropiedades()}
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
