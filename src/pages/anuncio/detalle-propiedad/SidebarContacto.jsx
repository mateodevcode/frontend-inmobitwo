import { BsTelephone } from "react-icons/bs";
import { PiChats } from "react-icons/pi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import useTracking from "@/hooks/useTracking";
import { useState } from "react";

const SidebarContacto = ({ inmueble }) => {
  const { dispararEventoYRevisar } = useTracking();
  const [mostrarTelefono, setMostrarTelefono] = useState(false);

  const handleContactarClick = () => {
    setMostrarTelefono(true);
    if (inmueble?.id) dispararEventoYRevisar(inmueble.id, "click_telefono");
  };

  return (
    <div className="border-t-4 border-tercero shadow-md bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-center text-lg">
          Pregunta al{" "}
          {inmueble.tipo === "organizacion" ? "anunciante" : "vendedor"}
        </h3>

        <div className="flex items-start gap-2 border-2 border-blue-300 bg-blue-50 rounded-sm p-3 mb-3">
          <TbAlertOctagonFilled className="text-lg text-black/80 shrink-0" />
          <p className="text-sm text-black/80">
            Contactá directamente para agendar una visita o resolver dudas.
          </p>
        </div>

        <button className="w-full bg-tercero text-white text-sm font-semibold rounded-sm py-2.5 hover:bg-tercero/80 transition-colors mb-4 flex items-center gap-2 justify-center cursor-pointer select-none">
          <PiChats className="text-2xl" />
          Contactar por chat
        </button>

        <div className="border-t border-gray-100 pt-3">
          {mostrarTelefono ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <BsTelephone className="text-base" />
              {inmueble.telefono_contacto || "No disponible"}
            </p>
          ) : (
            <button
              onClick={handleContactarClick}
              className="flex items-center gap-2 font-semibold text-blue-600 hover:underline"
            >
              <BsTelephone className="text-base" />
              Ver teléfono
            </button>
          )}

          <p className="text-xs text-gray-500 mt-4">Referencia del anuncio</p>
          <p className="text-sm text-gray-800">{inmueble.id}</p>

          <p className="text-xs text-gray-500 mt-4">Profesional</p>
          <p className="text-sm text-gray-800">Sellmi</p>

          <div className="border-t border-black/20 mt-4">
            {inmueble?.es_de_organizacion && (
              <div className="flex items-center w-full justify-between pt-4">
                <div className="">
                  <p className="text-sm text-blue-600 font-medium">Sellmi</p>
                  <p className="text-sm text-black/70 font-medium">Oviedo</p>
                </div>

                <div className="border border-segundo/10 w-32 h-16">
                  <img
                    src={
                      inmueble?.organizacion_logo_url || "/logo/logo-hor.png"
                    }
                    alt={inmueble?.organizacion_nombre || "Inmobiliaria"}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContacto;
