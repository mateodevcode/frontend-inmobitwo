// src/components/ModalContactoLead.jsx
import { useState } from "react";
import { toast } from "sonner";
import { IoIosClose } from "react-icons/io";
import { useAppContext } from "@/context/AppContext.js";
import useTracking from "@/hooks/useTracking";

const ModalContactoLead = () => {
  const {
    openModalContactoLead,
    setOpenModalContactoLead,
    leadPendienteContacto,
    setLeadPendienteContacto,
  } = useAppContext();
  const { actualizarContactoLead } = useTracking();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!openModalContactoLead || !leadPendienteContacto) return null;

  const cerrar = () => {
    setOpenModalContactoLead(false);
    setLeadPendienteContacto(null);
    setNombre("");
    setEmail("");
    setTelefono("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || (!email.trim() && !telefono.trim())) {
      toast.error("Ingresa tu nombre y al menos un email o teléfono.", {
        position: "bottom-right",
      });
      return;
    }

    setEnviando(true);
    try {
      const res = await actualizarContactoLead(leadPendienteContacto.id, {
        nombre: nombre.trim(),
        email: email.trim() || null,
        telefono: telefono.trim() || null,
      });

      if (!res?.success) {
        toast.error(res?.error || "No se pudo enviar tu contacto.", {
          position: "bottom-right",
        });
        return;
      }

      toast.success("¡Gracias! El agente se pondrá en contacto contigo.", {
        position: "bottom-right",
      });
      cerrar();
    } catch (error) {
      toast.error("Error inesperado.", { position: "bottom-right" });
      console.error("❌ Error en ModalContactoLead:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 font-montserrat px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-lg">
        <button
          type="button"
          onClick={cerrar}
          className="absolute top-3 right-3 text-2xl text-black/50 hover:text-black cursor-pointer select-none"
        >
          <IoIosClose />
        </button>

        <h3 className="text-xl font-bold text-black">
          ¿Quieres que te contactemos?
        </h3>
        <p className="text-black/70 mt-2">
          Déjanos tus datos y el agente se pondrá en contacto contigo lo antes
          posible.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-black/20 rounded-md px-4 py-2.5 outline-none focus:border-blue-600"
          />
          <input
            type="email"
            placeholder="Tu email (opcional si dejas teléfono)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black/20 rounded-md px-4 py-2.5 outline-none focus:border-blue-600"
          />
          <input
            type="tel"
            placeholder="Tu teléfono (opcional si dejas email)"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border border-black/20 rounded-md px-4 py-2.5 outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-rose-600 px-6 py-3 text-lg font-bold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Quiero que me contacten"}
          </button>

          <button
            type="button"
            onClick={cerrar}
            className="text-black/60 hover:text-black text-sm cursor-pointer select-none"
          >
            No, gracias
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalContactoLead;
