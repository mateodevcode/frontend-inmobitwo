import { Phone } from "lucide-react";
import { BsChatDots } from "react-icons/bs";

// Renderiza los canales de contacto del anuncio según la política elegida
// por el publicador (how_to_contact) y el número seleccionado.
const ContactoAnuncio = ({
  how_to_contact = "telefono_chat",
  telefono_contacto,
  telefonos = [],
  telefono,
}) => {
  const numeros = telefono_contacto
    ? [telefono_contacto]
    : telefonos.length > 0
      ? telefonos
      : telefono
        ? [telefono]
        : [];

  const showPhone = how_to_contact !== "solo_chat" && numeros.length > 0;
  const showChat = how_to_contact !== "solo_telefono";

  if (!showPhone && !showChat) return null;

  return (
    <div className="flex flex-col gap-3">
      {showPhone &&
        numeros.map((numero, i) => (
          <a
            key={i}
            href={`tel:${numero}`}
            className="flex items-center justify-center gap-2 rounded-md bg-tercero px-6 py-3 text-base font-semibold text-white hover:bg-tercero/80"
          >
            <Phone className="h-5 w-5" /> Llamar a {numero}
          </a>
        ))}
      {showChat && (
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
        >
          <BsChatDots className="h-5 w-5" /> Enviar mensaje
        </button>
      )}
    </div>
  );
};

export default ContactoAnuncio;
