import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { usePropertySearch } from "../hooks/usePropertySearch";
import { MapPin, Home as HomeIcon } from "lucide-react";
import L from "leaflet";
import { renderToString } from "react-dom/server";

import { useMap } from "react-leaflet";

// Componente que escucha cuando cambian las coordenadas y mueve el mapa automáticamente
function MapCameraController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      // Mueve la cámara de forma instantánea a la nueva posición geográfica
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Estilo del pin del mapa para que se vea limpio y no rompa por falta de assets locales de Leaflet
const customIcon = new L.Icon({
  iconUrl: MapPin,
  iconRetinaUrl: "https://unpkg.com",
  shadowUrl: "https://unpkg.com",
  iconSize: [25, 41], // 👈 Corregido: Dimensiones estándar en píxeles [ancho, alto]
  iconAnchor: [12, 41], // 👈 Corregido: Punto del icono que se ancla a la coordenada exacta [X, Y]
  popupAnchor: [1, -34],
  shadowSize: [41, 41], // 👈 Corregido: Tamaño de la sombra del marcador [ancho, alto]
});

// Diccionarios de traducción de Slugs de la URL a los términos exactos de tu Base de Datos
const MAPPING_OPERACIONES = {
  venta: "venta",
  alquiler: "alquiler",
};

const MAPPING_TIPOS = {
  viviendas: "piso,chalet,rustica",
  habitaciones: "habitacion",
  oficinas: "oficina",
  locales: "local",
  garajes: "garaje",
  trasteros: "trastero",
  terrenos: "terreno",
  edificios: "edificio",
  "casa-o-chalet": "chalet",
  "casa-rustica": "rustica",
};

export default function PropertySearchScreen() {
  const { operationAndType, cityAndDepartment } = useParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState(null);

  // 1. Extraer y validar los Slugs de la URL dinámicamente
  useEffect(() => {
    try {
      if (!operationAndType.includes("-") || !cityAndDepartment.includes("-")) {
        throw new Error("Formato de URL inválido");
      }

      const [rawOperation, ...typeParts] = operationAndType.split("-");
      const rawType = typeParts.join("-");

      const geoParts = cityAndDepartment.split("-");
      const rawDepartment = geoParts.pop();
      const rawCity = geoParts.join("-");

      const operacionLimpia = MAPPING_OPERACIONES[rawOperation.toLowerCase()];
      const tipoLimpio = MAPPING_TIPOS[rawType.toLowerCase()] || rawType;

      if (!operacionLimpia) throw new Error("Operación no válida");

      setSearchParams({
        operation: operacionLimpia,
        propertyType: tipoLimpio,
        citySlug: rawCity.toLowerCase(),
        departmentSlug: rawDepartment.toLowerCase(),
      });
    } catch (error) {
      toast.error("La zona o tipo de búsqueda no es válida.");
      navigate("/", { replace: true });
    }
  }, [operationAndType, cityAndDepartment, navigate]);

  // 2. Consumir la API de backend-inmobitwo usando nuestro Hook
  const { properties, loading, error } = usePropertySearch(searchParams);

  // Coordenadas fallback (Bogotá) en caso de que la lista venga vacía para centrar el mapa
  const defaultCenter = [4.60971, -74.08175];

  const mapCenter =
    properties.length > 0 && properties[0].latitude
      ? [properties[0].latitude, properties[0].longitude]
      : defaultCenter;

  // 👈 LOG 1: Abre la consola del navegador (F12) y dinos qué imprime esto
  console.log("Coordenadas calculadas para centrar el mapa:", mapCenter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full pt-11 bg-white font-poppins">
      {/* COLUMNA IZQUIERDA: Listado de Inmuebles (5 de 12 columnas) */}
      <div className="md:col-span-5 p-6 overflow-y-auto h-[calc(100vh-44px)] border-r border-black/5">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-black/90 capitalize mb-1">
            {searchParams?.operation} de {searchParams?.propertyType}
          </h1>
          <p className="text-sm text-black/50">
            Resultados en{" "}
            <span className="font-semibold capitalize">
              {searchParams?.citySlug}
            </span>
            , {searchParams?.departmentSlug?.toUpperCase()}
          </p>
        </div>

        {loading && (
          <p className="text-sm text-black/40 animate-pulse py-8">
            Cargando inmuebles de Inmobitwo...
          </p>
        )}

        {error && <p className="text-sm text-red-500 py-4">{error}</p>}

        {!loading && properties.length === 0 && (
          <div className="text-center py-12 border border-dashed border-black/10 rounded-sm bg-gray-50/50">
            <HomeIcon className="mx-auto text-black/20 mb-3" size={32} />
            <p className="text-sm font-medium text-black/60">
              No hay inmuebles publicados aquí aún.
            </p>
            <p className="text-xs text-black/40 mt-1">
              Sé el primero en publicar un anuncio en esta zona.
            </p>
          </div>
        )}

        {/* Mapeo de Tarjetas de Inmuebles */}
        <div className="flex flex-col gap-5">
          {properties.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row border border-black/10 bg-white hover:shadow-md transition-shadow duration-300 rounded-sm overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/inmueble/${item.id}`)}
            >
              {/* Imagen */}
              <div className="w-full sm:w-44 h-40 bg-black/5 relative shrink-0">
                <img
                  src={
                    item.imagen_principal_url || "/propiedades/placeholder.jpg"
                  }
                  alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
              {/* Información de la tarjeta */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-base font-bold text-black/80 line-clamp-1 group-hover:text-tercero transition-colors">
                    {item.titulo || "Inmueble destacado"}
                  </h2>
                  <p className="flex items-center gap-1 text-xs text-black/40 mt-1">
                    <MapPin size={12} /> {item.direccion}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-black/90">
                    ${" "}
                    {item.price && !isNaN(Number(item.price))
                      ? Number(item.price).toLocaleString("es-CO")
                      : "Consultar"}
                    <span className="text-xs font-normal text-black/50">
                      {item.operacion === "alquiler" ? " / mes" : ""}
                    </span>
                  </span>
                  <span className="text-xs px-2 py-1 bg-black/5 text-black/70 rounded-xs capitalize">
                    {item.tipo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA: Mapa Interactivo Gratuito (7 de 12 columnas) */}
      <div className="hidden md:block md:col-span-7 h-[calc(100vh-44px)] sticky top-11 z-10 bg-gray-100">
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          {/* Capa base de mapas limpios de CartoDB (Estilo Idealista Minimalista) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          {/* 👈 INYECTA ESTA LÍNEA AQUÍ: Moverá la cámara automáticamente a Barranquilla */}
          <MapCameraController center={mapCenter} />

          {/* Renderizado de pines dinámicos en el mapa */}
          {properties.map(
            (item) =>
              item.latitude &&
              item.longitude && (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-1 font-poppins max-w-44">
                      <p className="text-xs font-bold text-black/90 line-clamp-1">
                        {item.titulo}
                      </p>
                      <p className="text-xs font-extrabold text-tercero mt-1">
                        $ {Number(item.price).toLocaleString("es-CO")}
                      </p>
                      <button
                        onClick={() => navigate(`/inmueble/${item.id}`)}
                        className="mt-2 w-full text-center text-[10px] bg-black text-white py-1 rounded-xs font-semibold cursor-pointer"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ),
          )}
        </MapContainer>
      </div>
    </div>
  );
}
