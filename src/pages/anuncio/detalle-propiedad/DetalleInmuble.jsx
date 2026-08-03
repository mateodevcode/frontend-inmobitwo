import { useNavigate } from "react-router-dom";
import PropertyImage from "@/components/common/PropertyImage";
import { BiNotepad } from "react-icons/bi";
import { PiChats } from "react-icons/pi";
import { BsCameraFill } from "react-icons/bs";
import { HiOutlineFlag } from "react-icons/hi2";
import UbicacionMapa from "../UbicacionMapa";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import { useState } from "react";
import useScrollSentinel from "@/hooks/useScrollSentinel";

const DetalleInmuble = ({
  inmueble,
  setMostrarBarraSticky,
  totalImagenes,
  fotos,
}) => {
  const navigate = useNavigate();

  const descripcionLarga = inmueble.descripcion || "";
  const necesitaTruncar = descripcionLarga.length > 280;
  const [descripcionAbierta, setDescripcionAbierta] = useState(false);
  const mostrarDescripcion = true;

  // Sentinel: cuando esto sale del viewport por arriba (scroll pasado el
  // bloque de precio), se activa la barra sticky del header. Único punto
  // de control de la barra sticky en todo el flujo.
  const sentinelRef = useScrollSentinel(setMostrarBarraSticky);

  return (
    <div className="min-w-0 bg-white font-poppins">
      <div ref={sentinelRef} />

      <div className="bg-orange-50 w-full h-16 flex items-center px-6 text-blue-600 gap-2 hover:underline">
        <BiNotepad className="text-lg" />
        <p className="text-sm font-semibold">Añadir tu nota</p>
      </div>

      {/* Descripción */}
      {mostrarDescripcion && (
        <div className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Descripción</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            Piso en venta en zona Seminario, Oviedo (Asturias, España). Precio:
            299.000 €. Superficie construida: 90 m². 3 habitaciones y 2 baños.
            3ª planta exterior. Tour virtual 3D disponible. Piso en venta
            situado muy cerca del Seminario y del Parque de Invierno, en Oviedo.
            Está ubicado en la tercera planta de un edificio construido en 1991,
            sin barreras arquitectónicas y que cuenta con portal reformado y
            ascensor. La vivienda, que se encuentra en buen estado, tiene una
            superficie construida de 90 m² distribuidos en hall de entrada,
            salón comedor, cocina amueblada, tres habitaciones y dos baños
            completos. Dispone de calefacción individual de gas natural, suelos
            de parquet y gres, ventanas de doble acristalamiento, puerta de
            seguridad, videoportero, etc. Es exterior y muy luminoso, con
            orientación sureste. Gastos de comunidad: 77 € al mes.
          </p>
          {necesitaTruncar && (
            <button
              onClick={() => setDescripcionAbierta((v) => !v)}
              className="text-sm font-semibold text-blue-600 hover:underline mt-2"
            >
              {descripcionAbierta ? "Leer menos" : "Leer descripción completa"}
            </button>
          )}

          {mostrarDescripcion && (
            <div className="text-sm text-gray-600 mt-4 flex items-center gap-2 border-t border-black/10 pt-4">
              <PiChats className="text-base" />
              Si tenés alguna duda podés hablar con{" "}
              <span className="font-semibold">
                {inmueble.contacto_nombre}
              </span>{" "}
              por chat.
            </div>
          )}
        </div>
      )}

      {/* Características básicas */}
      <div className="py-5 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Características básicas
            </h2>
            <ul className="text-sm text-gray-700 space-y-1.5">
              {inmueble.area_m2 && <li>· {inmueble.area_m2} m² construidos</li>}
              {inmueble.habitaciones != null && (
                <li>· {inmueble.habitaciones} habitaciones</li>
              )}
              {inmueble.banos != null && <li>· {inmueble.banos} baños</li>}
              {inmueble.balcon && <li>· Balcón</li>}
              {inmueble.estado && <li>· {inmueble.estado}</li>}
              {inmueble.armarios_empotrados && <li>· Armarios empotrados</li>}
              {inmueble.orientacion && (
                <li>· Orientación {inmueble.orientacion}</li>
              )}
              {inmueble.anno_construccion && (
                <li>· Construido en {inmueble.anno_construccion}</li>
              )}
              {inmueble.amueblado && <li>· Amueblado y cocina equipada</li>}
              {inmueble.calefaccion && (
                <li>· Calefacción {inmueble.calefaccion}</li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Certificado energético
            </h2>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li>· {inmueble.certificado_energetico || "No indicado"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fotos completas */}
      {totalImagenes > 0 && (
        <div id="fotos-section" className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BsCameraFill className="text-base" />
            Fotos
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {fotos.map((foto, i) => (
              <PropertyImage
                key={i}
                foto={foto}
                tamañoBase="large"
                sizes="(max-width: 768px) 100vw, 800px"
                alt=""
                className="w-full rounded-sm object-cover cursor-pointer"
                onClick={() =>
                  navigate(`/inmueble/${inmueble.id}/foto/${i + 1}`)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Reportar error */}
      <div className="py-5 border-b border-gray-200">
        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <HiOutlineFlag className="text-base" />
          ¿Hay algún error en este anuncio?
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Infórmanos para corregirlo y ayudar a otras personas.
        </p>
        <button className="text-sm font-semibold text-blue-600 hover:underline mt-1">
          Cuéntanos qué error has visto
        </button>
      </div>

      {/* Precio */}
      <div className="py-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Precio</h2>
        <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
          <span>Precio del inmueble:</span>
          <span className="font-bold text-gray-900">
            {formatPrecioCompleto(inmueble.precio)}
            {inmueble.operacion === "alquiler" ? "/mes" : ""}
          </span>
        </div>
        {inmueble.area_m2 > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
            <span>Precio por m²:</span>
            <span>
              {(inmueble.precio / inmueble.area_m2).toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}{" "}
              /m²
            </span>
          </div>
        )}
        {inmueble.fianza_meses && (
          <p className="text-sm text-gray-700">
            Fianza de {inmueble.fianza_meses} mes
            {inmueble.fianza_meses > 1 ? "es" : ""}
          </p>
        )}
      </div>

      {/* Ubicación */}
      {inmueble.latitude && inmueble.longitude && (
        <div id="ubicacion-section" className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ubicación</h2>
          <div className="text-sm text-gray-700 space-y-0.5 mb-3">
            {inmueble.direccion && <p>{inmueble.direccion}</p>}
            {inmueble.barrio_name && <p>Barrio {inmueble.barrio_name}</p>}
            {inmueble.city_name && (
              <p>
                {inmueble.city_name}
                {inmueble.state_name ? `, ${inmueble.state_name}` : ""}
              </p>
            )}
          </div>
          <UbicacionMapa lat={inmueble.latitude} lng={inmueble.longitude} />
        </div>
      )}

      {/* Estadísticas */}
      <div className="py-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Estadísticas</h2>
        {inmueble.fecha_actualizacion && (
          <p className="text-sm text-gray-700">
            Anuncio actualizado el{" "}
            {new Date(inmueble.fecha_actualizacion).toLocaleDateString(
              "es-CO",
              { day: "numeric", month: "long" },
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetalleInmuble;
