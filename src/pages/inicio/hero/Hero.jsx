import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";
import InputSearchPrincipal from "../modales/InputSearchPrincipal";
import SelectorTipo from "../modales/SelectorTipo";
import { MAPPING_OPERACIONES } from "@/data/mappings_busqueda";

const TIPO_DEFAULT = { label: "Apartamento", slug: "apartamento" };

const FRASES = {
  mobile: [
    "Encuentra tu hogar",
    "Compra sin complicaciones",
    "Alquila fácil",
    "Tu inmueble ideal",
    "Vivir mejor",
  ],
  desktop: [
    "No vendemos casas. Conectamos personas.",
    "Toda gran historia empieza con una llave",
    "Cada inmueble espera a la persona correcta",
    "Mudarse también es empezar de nuevo",
    "Aquí las oportunidades tienen dirección",
    "Donde comprar y vender vuelve a ser sencillo",
  ],
};

const Hero = ({
  image = "/propiedades/chalet.jpg",
  propertyLabel = "Oficina en Alicante / Alacant, Alicante - 399.000 eur",
  propertyUrl = "#",
  tab,
  setTab,
  tipo,
  setTipo,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [frases, setFrases] = useState(
    window.innerWidth < 768 ? FRASES.mobile : FRASES.desktop,
  );

  useEffect(() => {
    let ticking = false;
    const onResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setFrases(window.innerWidth < 768 ? FRASES.mobile : FRASES.desktop);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!selectedGeo) return;

    const operationSlug = MAPPING_OPERACIONES[tab] || tab;
    const firstSegment = `${operationSlug}-${tipo.slug}`;

    let secondSegment;
    if (selectedGeo.type === "region") {
      secondSegment = selectedGeo.regionSlug;
    } else if (selectedGeo.type === "departamento") {
      secondSegment = selectedGeo.departmentSlug;
    } else {
      secondSegment = `${selectedGeo.citySlug}-${selectedGeo.departmentSlug}`;
    }

    navigate(`/${firstSegment}/${secondSegment}`);
  }, [selectedGeo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="w-full flex justify-center font-poppins">
      <div className="relative w-12/12 md:w-9/12">
        <div className="group relative w-full h-100 md:h-100 overflow-hidden">
          <img
            src={image}
            alt="Interior de una vivienda"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <a
            href={propertyUrl}
            className="absolute top-0 right-0 z-10 bg-white/80 text-blue-800 text-xs md:text-xs font-medium px-3 py-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:underline"
          >
            {propertyLabel}
          </a>
        </div>

        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 w-[95%] md:w-11/12 max-w-4xl bg-gray-100 px-6 py-6 md:px-10 md:py-8 rounded-sm shadow-xl border border-black/20">
          <AnimatedTitle
            texts={frases}
            className="text-xl md:text-2xl font-semibold text-black text-center md:my-2 my-4 normal-case"
            wrapperClassName="mb-4 md:mb-5"
          />

          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex">
              <button
                onClick={() => {
                  setTab("comprar");
                  setTipo(TIPO_DEFAULT);
                }}
                className={`px-5 h-11 text-sm font-semibold border transition-colors cursor-pointer ${
                  tab === "comprar"
                    ? "bg-tercero/10 text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Comprar
              </button>
              <button
                onClick={() => {
                  setTab("alquilar");
                  setTipo(TIPO_DEFAULT);
                }}
                className={`px-5 h-11 text-sm font-semibold border transition-colors cursor-pointer ${
                  tab === "alquilar"
                    ? "bg-tercero/10 text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Alquilar
              </button>
            </div>

            <SelectorTipo tab={tab} value={tipo} onChange={setTipo} />

            <InputSearchPrincipal
              onGeoSelect={setSelectedGeo}
              setQuery={setQuery}
              query={query}
              operation={tab}
              tipo={tipo}
            />

            <button
              onClick={() => {
                if (!selectedGeo || query.trim() === "") return;
                navigate(
                  `/${MAPPING_OPERACIONES[tab] || tab}-${tipo.slug}/${selectedGeo.type === "region" ? selectedGeo.regionSlug : selectedGeo.type === "departamento" ? selectedGeo.departmentSlug : `${selectedGeo.citySlug}-${selectedGeo.departmentSlug}`}`,
                );
              }}
              disabled={!selectedGeo || query.trim() === ""}
              className={`relative flex items-center justify-center gap-2 px-8 h-11 select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 w-28 ${
                !selectedGeo || query.trim() === ""
                  ? "bg-black/80 text-white/90"
                  : "bg-black text-white cursor-pointer"
              }`}
            >
              <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
                Buscar
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
