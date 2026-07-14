// src/pages/organizacion/temas/tema1/Contacto.jsx
import { useOutletContext } from "react-router-dom";

const Contacto = () => {
  const organizacion = useOutletContext();
  if (!organizacion) return null;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Contacto</h1>
      <div className="space-y-2 text-gray-600">
        {organizacion.telefono && <p>Teléfono: {organizacion.telefono}</p>}
        {organizacion.email && <p>Email: {organizacion.email}</p>}
      </div>
    </div>
  );
};

export default Contacto;
