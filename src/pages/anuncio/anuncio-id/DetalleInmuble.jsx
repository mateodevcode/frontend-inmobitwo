import { useNavigate } from "react-router-dom";
import PropertyImage from "@/components/common/PropertyImage";
import { BiNotepad } from "react-icons/bi";
import { PiChats } from "react-icons/pi";
import { BsCameraFill } from "react-icons/bs";
import { HiOutlineFlag } from "react-icons/hi2";
import UbicacionMapa from "../UbicacionMapa";
import { formatPrecioCompleto } from "@/utils/formatPrecio";
import { useState, useEffect } from "react";
import useScrollSentinel from "@/hooks/useScrollSentinel";
import { apiBackend } from "@/api/apiBackend";

const DetalleInmuble = ({
  inmueble,
  setMostrarBarraSticky,
  totalImagenes,
  fotos,
}) => {
  const navigate = useNavigate();

  const descripcionLarga = inmueble.description || "";
  const [descripcionAbierta, setDescripcionAbierta] = useState(false);
  const mostrarDescripcion = !!descripcionLarga;

  // Historial de precios
  const [historialPrecios, setHistorialPrecios] = useState([]);
  useEffect(() => {
    let activo = true;
    if (!inmueble?.id) return;
    apiBackend(`/propiedades/${inmueble.id}/historial-precios`)
      .then((res) => {
        if (activo && res.success) setHistorialPrecios(res.data || []);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [inmueble?.id]);

  // Sentinel: cuando esto sale del viewport por arriba (scroll pasado el
  // bloque de precio), se activa la barra sticky del header. Único punto
  // de control de la barra sticky en todo el flujo.
  const sentinelRef = useScrollSentinel(setMostrarBarraSticky);

  const caracteristicas = inmueble.caracteristicas || {};
  const categorias = Object.keys(caracteristicas);

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
            {descripcionAbierta
              ? descripcionLarga
              : descripcionLarga.slice(0, 280)}
          </p>
          {descripcionLarga.length > 280 && (
            <button
              onClick={() => setDescripcionAbierta((v) => !v)}
              className="text-sm font-semibold text-blue-600 hover:underline mt-2"
            >
              {descripcionAbierta
                ? "Leer menos"
                : "Leer descripción completa"}
            </button>
          )}

          {inmueble.usuario_nombre && (
            <div className="text-sm text-gray-600 mt-4 flex items-center gap-2 border-t border-black/10 pt-4">
              <PiChats className="text-base" />
              Si tenés alguna duda podés hablar con{" "}
              <span className="font-semibold">
                {inmueble.usuario_nombre}
              </span>{" "}
              por chat.
            </div>
          )}
        </div>
      )}

      {/* Características básicas */}
      <div className="py-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Características básicas
        </h2>
        <ul className="text-sm text-gray-700 space-y-1.5">
          {inmueble.constructed_area != null && (
            <li>· {inmueble.constructed_area} m² construidos</li>
          )}
          {inmueble.private_area != null && (
            <li>· {inmueble.private_area} m² área privada</li>
          )}
          {inmueble.room_count != null && (
            <li>· {inmueble.room_count} ambientes</li>
          )}
          {inmueble.bedroom_count != null && (
            <li>· {inmueble.bedroom_count} alcobas</li>
          )}
          {inmueble.bathroom_count != null && (
            <li>· {inmueble.bathroom_count} baños completos</li>
          )}
          {inmueble.social_bathroom_count != null && (
            <li>· {inmueble.social_bathroom_count} baño social</li>
          )}
          {inmueble.estrato != null && <li>· Estrato {inmueble.estrato}</li>}
          {inmueble.estado_conservacion && (
            <li>· Estado: {inmueble.estado_conservacion}</li>
          )}
          {inmueble.construction_year != null && (
            <li>· Construido en {inmueble.construction_year}</li>
          )}
          {inmueble.floor && <li>· Piso {inmueble.floor}</li>}
          {inmueble.parqueadero_tipo && (
            <li>
              · Parqueadero {inmueble.parqueadero_tipo}
              {inmueble.parqueadero_modo
                ? ` (${inmueble.parqueadero_modo})`
                : ""}
            </li>
          )}
          {inmueble.parking_space_count != null && (
            <li>· {inmueble.parking_space_count} parqueadero(s)</li>
          )}
          {inmueble.administracion != null && (
            <li>· Administración: {formatPrecioCompleto(inmueble.administracion)}</li>
          )}
          {inmueble.zona && <li>· Zona: {inmueble.zona}</li>}
          {inmueble.has_elevator && <li>· Ascensor</li>}
          {inmueble.has_swimming_pool && <li>· Piscina</li>}
          {inmueble.has_gym && <li>· Gimnasio</li>}
          {inmueble.has_security_24h && <li>· Seguridad 24 horas</li>}
          {inmueble.has_air_conditioning && <li>· Aire acondicionado</li>}
          {inmueble.is_furnished && <li>· Amoblado</li>}
        </ul>
      </div>

      {/* Características N:M agrupadas por categoría */}
      {categorias.length > 0 && (
        <div className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Características
          </h2>
          {categorias.map((categoria) => (
            <div key={categoria} className="mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                {categoria}
              </h3>
              <p className="text-sm text-gray-700">
                {caracteristicas[categoria]
                  .map((f) => f.label_es)
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

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
            {inmueble.operacion === "arriendo" ? "/mes" : ""}
          </span>
        </div>
        {inmueble.price_per_sqm != null && (
          <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
            <span>Precio por m²:</span>
            <span>{formatPrecioCompleto(inmueble.price_per_sqm)} /m²</span>
          </div>
        )}
      </div>

      {/* Historial de precios */}
      {historialPrecios.length > 0 && (
        <div className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Historial de precios
          </h2>
          <ul className="text-sm text-gray-700 space-y-1.5">
            {historialPrecios.map((h) => (
              <li key={h.id}>
                {new Date(h.detected_at).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {": "}
                {h.old_price != null
                  ? `${formatPrecioCompleto(h.old_price)} → `
                  : ""}
                {formatPrecioCompleto(h.new_price)}
                {h.change_percent != null &&
                  ` (${h.change_percent > 0 ? "↑" : "↓"} ${Math.abs(
                    h.change_percent,
                  )}%)`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ubicación */}
      {inmueble.latitude && inmueble.longitude && (
        <div id="ubicacion-section" className="py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ubicación</h2>
          <div className="text-sm text-gray-700 space-y-0.5 mb-3">
            {inmueble.direccion && <p>{inmueble.direccion}</p>}
            {inmueble.barrio && <p>Barrio {inmueble.barrio}</p>}
            {inmueble.ciudad && (
              <p>
                {inmueble.ciudad}
                {inmueble.departamento ? `, ${inmueble.departamento}` : ""}
              </p>
            )}
          </div>
          <UbicacionMapa lat={inmueble.latitude} lng={inmueble.longitude} />
        </div>
      )}

      {/* Estadísticas */}
      <div className="py-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Estadísticas</h2>
        {inmueble.updated_at && (
          <p className="text-sm text-gray-700">
            Anuncio actualizado el{" "}
            {new Date(inmueble.updated_at).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetalleInmuble;
