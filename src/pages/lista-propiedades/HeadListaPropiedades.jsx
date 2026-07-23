import { useEffect, useState } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdArrowDropDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import { apiBackend } from "@/api/apiBackend";

const MAPPING_OPERACIONES = {
  arriendo: "arriendo",
  venta: "venta",
  alquiler: "arriendo",
};

const MAPPING_TIPOS = {
  viviendas: "piso",
  habitaciones: "habitacion",
  oficinas: "oficina",
  locales: "local",
  garajes: "garaje",
  terrenos: "terreno",
  edificios: "edificio",
  "casa-o-chalet": "chalet",
  "casa-rustica": "rustica",
  "obra-nueva": "obra-nueva",
  vacacional: "vacacional",
};

const OPERATION_LABELS = {
  venta: "venta",
  arriendo: "alquiler",
};

const TYPE_LABELS = {
  viviendas: "viviendas",
  "obra-nueva": "obra nueva",
  vacacional: "vacacional",
};

const HeadListaPropiedades = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  // 1. Parseamos la URL actual para extraer operación, tipo y el segmento de geolocalización
  // Ej: /venta-viviendas/barranquilla-atlantico
  //     -> firstSegment = "venta-viviendas", geoSegment = "barranquilla-atlantico"
  const pathParts = location.pathname.split("/").filter(Boolean);
  const [firstSegment, geoSegment] = pathParts;

  let operationSlug = "venta";
  let typeSlug = "viviendas";

  if (firstSegment) {
    // Solo partimos en el PRIMER guion: la operación siempre es una sola palabra
    // ("venta" | "arriendo"), pero el tipo puede tener guiones ("obra-nueva").
    const dashIndex = firstSegment.indexOf("-");
    if (dashIndex !== -1) {
      operationSlug = firstSegment.slice(0, dashIndex);
      typeSlug = firstSegment.slice(dashIndex + 1);
    } else {
      operationSlug = firstSegment;
    }
  }

  let citySlug = "";
  let deptSlug = "";
  let isSingleSegment = false;
  if (geoSegment) {
    const geoParts = geoSegment.split("-");
    if (geoParts.length === 1) {
      isSingleSegment = true;
      deptSlug = geoParts[0];
    } else {
      deptSlug = geoParts.pop();
      citySlug = geoParts.join("-");
    }
  }

  const operationDb = MAPPING_OPERACIONES[operationSlug] || operationSlug;
  const typeDb = MAPPING_TIPOS[typeSlug] || typeSlug;
  const typeLabel = TYPE_LABELS[typeSlug] || typeSlug;
  const operationLabel = OPERATION_LABELS[operationSlug] || operationSlug;

  useEffect(() => {
    if (!deptSlug) return;
    if (isSingleSegment) {
      apiBackend(
        `/api/location-info?dept=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
      ).then((res) => {
        if (res.success) {
          setLocationInfo(res.data);
        } else {
          apiBackend(
            `/api/location-info?region=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
          ).then((res2) => {
            if (res2.success) setLocationInfo(res2.data);
          });
        }
      });
    } else {
      apiBackend(
        `/api/location-info?city=${citySlug}&dept=${deptSlug}&operation=${operationDb}&type=${typeDb}`,
      ).then((res) => {
        if (res.success) setLocationInfo(res.data);
      });
    }
  }, [citySlug, deptSlug, operationDb, typeDb, isSingleSegment]);

  // 2. Derivamos qué tab está activo a partir de la URL, no de un estado local
  let selectedId;
  if (typeSlug === "vacacional") {
    selectedId = "vacacional";
  } else if (typeSlug === "obra-nueva") {
    selectedId = "obra-nueva";
  } else if (operationSlug === "arriendo") {
    selectedId = "alquilar";
  } else {
    selectedId = "comprar";
  }

  // 3. El "modo" (compra/alquiler) determina cuál es el tercer tab contextual
  const mode = operationSlug === "arriendo" ? "alquiler" : "compra";

  const thirdTab =
    mode === "alquiler"
      ? {
          nombre: "Vacacional",
          id: "vacacional",
          urlSegment: "arriendo-vacacional",
        }
      : {
          nombre: "Obra nueva",
          id: "obra-nueva",
          urlSegment: "venta-obra-nueva",
        };

  const tabs = [
    { nombre: "Comprar", id: "comprar", urlSegment: "venta-viviendas" },
    { nombre: "Alquilar", id: "alquilar", urlSegment: "arriendo-viviendas" },
    thirdTab,
  ];

  const handleTabClick = (tab) => {
    if (tab.id === selectedId) return;

    // Mantenemos el segmento de ciudad-departamento intacto, solo cambia el primero
    const newPath = geoSegment
      ? `/${tab.urlSegment}/${geoSegment}`
      : `/${tab.urlSegment}`;

    navigate(newPath);
  };

  return (
    <div className="w-[90%] 2xl:w-10/12 h-48 flex flex-col justify-between">
      <div className="flex items-center gap-2 mt-2 text-sm">
        <div className="text-blue-600">inmobitwo</div>
        <MdOutlineKeyboardArrowRight />
        <div className="relative">
          <div className="text-blue-600">
            {locationInfo?.tipo === "region"
              ? locationInfo?.region_name
              : locationInfo?.state_name || geoSegment?.split("-").pop()}
          </div>
          <div className="absolute top-6">
            {locationInfo?.total_state_all?.toLocaleString() || ""}
          </div>
        </div>
        {locationInfo?.tipo === "ciudad" && (
          <>
            <MdOutlineKeyboardArrowRight />
            <div className="relative">
              <div className="text-segundo">
                {locationInfo?.city_name || citySlug}
              </div>
              <div className="absolute top-6">
                {locationInfo?.total_city?.toLocaleString() || ""}
              </div>
            </div>
          </>
        )}
        <div>
          <MdArrowDropDown />
        </div>
      </div>

      <div className="w-full h-28 flex">
        {/* Boton de suscripcion */}
        <div className="bg-septimo w-[25%] h-full rounded-sm flex items-center justify-center flex-col gap-4">
          <h3 className="text-segundo text-sm font-semibold">
            Nuevos anuncios en tu email
          </h3>
          <button className="relative flex items-center justify-center gap-2 px-8 bg-black text-white h-11 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-tercero before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0 w-10/12 rounded-md">
            <IoNotificationsSharp className="text-lg relative z-10 group-hover:text-white transition-colors duration-300 font-semibold" />
            <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300 font-semibold">
              Guardar búsqueda
            </p>
          </button>
        </div>

        {/* Header busqueda */}
        <div className="w-[75%] h-full flex flex-col justify-between">
          <div className="flex gap-4 mx-4">
            <div className="flex flex-wrap items-center gap-1 font-semibold text-2xl text-segundo">
              <p>{locationInfo?.total_matching?.toLocaleString() || 0}</p>
              <p>
                {typeLabel} en {operationLabel}{" "}
                {locationInfo?.tipo === "region"
                  ? `en ${locationInfo?.region_name}`
                  : locationInfo?.tipo === "departamento"
                    ? `en ${locationInfo?.state_name}` + (locationInfo?.region_name ? `, ${locationInfo?.region_name}` : "")
                    : `en ${locationInfo?.city_name || citySlug}, ${locationInfo?.state_name || geoSegment?.split("-").pop()}`
                }
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-500 font-semibold text-base min-w-48 cursor-pointer select-none hover:text-blue-600">
              <SiOpenstreetmap />
              <p className="">Modificar zona</p>
            </div>
          </div>

          <div className="h-9 relative flex gap-2 mx-4">
            {tabs.map((tab) => {
              const isActive = tab.id === selectedId || tab.id === hovered;

              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  onMouseEnter={() => setHovered(tab.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="px-4 cursor-pointer relative"
                >
                  <p
                    className={`font-semibold select-none hover:text-tercero text-cuarto ${
                      isActive ? "text-tercero" : "text-cuarto"
                    }`}
                  >
                    {tab.nombre}
                  </p>

                  <span
                    className="absolute left-0 bottom-0 h-0.5 w-full bg-tercero origin-left transition-transform duration-300 ease-out z-10"
                    style={{
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </div>
              );
            })}

            {/* Línea final fija */}
            <div className="h-0.5 w-full bg-gray-300 absolute bottom-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadListaPropiedades;
