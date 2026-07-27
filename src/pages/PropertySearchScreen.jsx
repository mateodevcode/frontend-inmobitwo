import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import * as maplibregl from "maplibre-gl";
import { usePropertySearch } from "../hooks/usePropertySearch";
import { Home as HomeIcon } from "lucide-react";

const pinSvg = `
  <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.6 12.5 27 12.5 27s12.5-18.4 12.5-27C25 5.6 19.4 0 12.5 0z" fill="#e6007a"/>
    <circle cx="12.5" cy="12.5" r="5" fill="white"/>
  </svg>
`;

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

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [searchParams, setSearchParams] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    try {
      if (!operationAndType.includes("-") || !cityAndDepartment.includes("-")) {
        throw new Error("Formato de URL invalido");
      }

      const [rawOperation, ...typeParts] = operationAndType.split("-");
      const rawType = typeParts.join("-");

      const geoParts = cityAndDepartment.split("-");
      const rawDepartment = geoParts.pop();
      const rawCity = geoParts.join("-");

      const operacionLimpia = MAPPING_OPERACIONES[rawOperation.toLowerCase()];
      const tipoLimpio = MAPPING_TIPOS[rawType.toLowerCase()] || rawType;

      if (!operacionLimpia) throw new Error("Operacion no valida");

      setSearchParams({
        operation: operacionLimpia,
        propertyType: tipoLimpio,
        citySlug: rawCity.toLowerCase(),
        departmentSlug: rawDepartment.toLowerCase(),
      });
    } catch (error) {
      toast.error("La zona o tipo de busqueda no es valida.");
      navigate("/", { replace: true });
    }
  }, [operationAndType, cityAndDepartment, navigate]);

  const { properties, loading, error } = usePropertySearch(searchParams);

  const defaultCenter = [4.60971, -74.08175];

  const mapCenter =
    properties.length > 0 && properties[0].latitude
      ? [properties[0].latitude, properties[0].longitude]
      : defaultCenter;

  // ──── Inicializar mapa ────
  useEffect(() => {
    if (mapInstanceRef.current) return;
    console.log("[PropertySearch] Creando mapa...");

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } },
        layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
      },
      center: [mapCenter[1], mapCenter[0]],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    mapInstanceRef.current = map;

    map.on("load", () => {
      console.log("[PropertySearch] Mapa cargado");
    });

    map.on("error", (e) => {
      console.error("[PropertySearch] Error del mapa:", e);
    });

    return () => {
      console.log("[PropertySearch] Destruyendo mapa");
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ──── Sincronizar centro del mapa ────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;
    console.log("[PropertySearch] Centrando mapa en:", mapCenter);
    map.flyTo({ center: [mapCenter[1], mapCenter[0]] });
  }, [mapCenter]);

  // ──── Renderizar markers ────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) {
      console.log("[PropertySearch] renderMarkers: mapa no listo");
      return;
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    console.log(
      `[PropertySearch] Renderizando ${properties.length} markers`,
    );

    properties.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      const el = document.createElement("div");
      el.innerHTML = pinSvg;
      el.className = "cursor-pointer";
      el.addEventListener("click", () => {
        setPopupInfo(item);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([item.longitude, item.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [properties]);

  // ──── Manejar popup nativo de MapLibre ────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (!popupInfo) return;

    const popupContent = document.createElement("div");
    popupContent.className = "p-1 font-poppins max-w-44";
    popupContent.innerHTML = `
      <p class="text-xs font-bold text-black/90 line-clamp-1">${popupInfo.titulo || ""}</p>
      <p class="text-xs font-extrabold text-[#e6007a] mt-1" style="color: #e6007a; font-weight: 800;">$ ${Number(popupInfo.price).toLocaleString("es-CO")}</p>
    `;

    const btn = document.createElement("button");
    btn.className =
      "mt-2 w-full text-center text-[10px] bg-black text-white py-1 rounded-xs font-semibold cursor-pointer";
    btn.textContent = "Ver detalle";
    btn.addEventListener("click", () => navigate(`/inmueble/${popupInfo.id}`));
    popupContent.appendChild(btn);

    const popup = new maplibregl.Popup({ offset: 30, closeButton: false })
      .setLngLat([popupInfo.longitude, popupInfo.latitude])
      .setDOMContent(popupContent)
      .addTo(map);

    popup.on("close", () => setPopupInfo(null));
    popupRef.current = popup;

    return () => {
      popup.remove();
      popupRef.current = null;
    };
  }, [popupInfo, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full pt-11 bg-white font-poppins">
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
              No hay inmuebles publicados aqui aun.
            </p>
            <p className="text-xs text-black/40 mt-1">
              Se el primero en publicar un anuncio en esta zona.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {properties.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row border border-black/10 bg-white hover:shadow-md transition-shadow duration-300 rounded-sm overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/inmueble/${item.id}`)}
            >
              <div className="w-full sm:w-44 h-40 bg-black/5 relative shrink-0">
                <img
                  src={
                    item.imagen_principal_url || "/propiedades/placeholder.jpg"
                  }
                  alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-base font-bold text-black/80 line-clamp-1 group-hover:text-tercero transition-colors">
                    {item.titulo || "Inmueble destacado"}
                  </h2>
                  <p className="flex items-center gap-1 text-xs text-black/40 mt-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>{" "}
                    {item.direccion}
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

      <div className="hidden md:block md:col-span-7 h-[calc(100vh-44px)] sticky top-11 z-10 bg-gray-100">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
