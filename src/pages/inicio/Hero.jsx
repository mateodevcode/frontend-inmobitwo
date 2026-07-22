import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importación clave
import AnimatedTitle from "./AnimatedTitle";
import InputSearchPrincipal from "./modales/InputSearchPrincipal";
import SelectorTipo from "./modales/SelectorTipo";

const SLUGS_MAPPING = {
  // Operaciones
  comprar: "venta",
  alquilar: "arriendo",

  // Tipos (Traduce el texto visual del select al ID que espera la DB)
  Viviendas: "viviendas", // En la URL se verá "viviendas", pero el Front lo traducirá a "piso"
  Habitación: "habitacion", // Ajustado a tu ID real sin tilde
  Vacacional: "vacacional",
  Garajes: "garaje", // Ajustado a tu ID real en singular
  Trasteros: "trastero", // Ajustado a tu ID real en singular
  Oficinas: "oficina", // Ajustado a tu ID real en singular
  "Locales o naves": "local", // Ajustado a tu ID real "local"
  Traspasos: "traspaso",
  Terrenos: "terreno", // Ajustado a tu ID real en singular
  Edificios: "edificio", // Ajustado a tu ID real en singular
  "Obra nueva": "obra-nueva",
};

const Hero = ({
  image = "/propiedades/chalet.jpg",
  propertyLabel = "Oficina en Alicante / Alacant, Alicante - 399.000 eur",
  propertyUrl = "#",
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("comprar"); // "comprar" | "alquilar"
  const [tipo, setTipo] = useState("Viviendas");
  const [query, setQuery] = useState("");

  // Estado para capturar la geolocalización seleccionada desde el autocompletado
  const [selectedGeo, setSelectedGeo] = useState({
    citySlug: "bogota", // Valor fallback por defecto
    departmentSlug: "dc", // Valor fallback por defecto
  });

  const handleSearchSubmit = () => {
    // 1. Obtener los equivalentes limpios para el SEO de la URL
    const operationSlug = SLUGS_MAPPING[tab];
    const typeSlug = SLUGS_MAPPING[tipo] || "viviendas";

    // 2. Unir los segmentos simulando el patrón estricto de Idealista
    const firstSegment = `${operationSlug}-${typeSlug}`;
    const secondSegment = `${selectedGeo.citySlug}-${selectedGeo.departmentSlug}`;

    // 3. Despachar la redirección a la ruta pública dinámica
    navigate(`/${firstSegment}/${secondSegment}`);
  };

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
            texts={[
              "Mejor ciento volando",
              "Encuentra tu próximo hogar",
              "Vende más rápido con nosotros",
            ]}
            className="text-xl md:text-2xl font-semibold text-black text-center md:my-2 my-4"
            wrapperClassName="mb-4 md:mb-5"
          />

          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex">
              <button
                onClick={() => setTab("comprar")}
                className={`px-5 h-11 text-sm font-semibold border transition-colors cursor-pointer ${
                  tab === "comprar"
                    ? "bg-tercero/10 text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Comprar
              </button>
              <button
                onClick={() => setTab("alquilar")}
                className={`px-5 h-11 text-sm font-semibold border transition-colors cursor-pointer ${
                  tab === "alquilar"
                    ? "bg-tercero/10 text-tercero border-tercero"
                    : "bg-white/60 text-black/70 border-black/10"
                }`}
              >
                Alquilar
              </button>
            </div>

            <SelectorTipo value={tipo} onChange={setTipo} />

            {/* Pasamos la función actualizadora de geolocalización al input de búsqueda */}
            <InputSearchPrincipal
              onGeoSelect={setSelectedGeo}
              setQuery={setQuery}
              query={query}
            />

            <button
              onClick={handleSearchSubmit}
              disabled={!selectedGeo || query.trim() === ""}
              className={`relative flex items-center gap-2 px-8 h-11 select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 before:transition-all before:duration-500 before:ease-in-out before:z-0 w-28 ${
                !selectedGeo || query.trim() === ""
                  ? "bg-black/40 text-white/60 cursor-not-allowed before:hidden"
                  : "bg-black text-white cursor-pointer hover:before:w-full"
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
