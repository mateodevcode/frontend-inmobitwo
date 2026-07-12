// src/pages/organizacion/CrearOrganizacionForm.jsx
import { useState } from "react";
import { useAppContext } from "@/context/AppContext.js";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

const estadoInicial = {
  nombre: "",
  email: "",
  telefono: "",
  website: "",
  descripcion: "",
  ciudad: "",
  provincia: "",
};

const CrearOrganizacionForm = () => {
  const { usuario } = useAppContext();
  const { crearOrganizacion } = useOrganizaciones();

  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [creada, setCreada] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    crearOrganizacion(e, formData, usuario?.id, setLoading, (data) => {
      setCreada(data);
      setFormData(estadoInicial);
    });
  };

  if (!usuario) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-gray-500">
          Debes iniciar sesión para solicitar la creación de una inmobiliaria.
        </p>
      </div>
    );
  }

  if (creada) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Solicitud enviada</h2>
        <p className="text-gray-500">
          Tu organización <strong>{creada.nombre}</strong> quedó registrada con
          la URL provisional:
        </p>
        <p className="mt-2 font-mono text-sm">/inmobiliarias/{creada.slug}</p>
        <p className="mt-4 text-sm text-gray-400">
          Queda pendiente de aprobación por nuestro equipo. Cuando quieras un
          dominio propio, podrás solicitarlo desde el panel de tu organización.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Crear mi inmobiliaria</h2>

      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre de la inmobiliaria"
        required
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email de contacto"
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="Sitio web (opcional)"
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        placeholder="Ciudad"
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="provincia"
        value={formData.provincia}
        onChange={handleChange}
        placeholder="Provincia"
        className="w-full border rounded-lg px-3 py-2"
      />
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        rows={3}
        className="w-full border rounded-lg px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Solicitar creación"}
      </button>
    </form>
  );
};

export default CrearOrganizacionForm;
