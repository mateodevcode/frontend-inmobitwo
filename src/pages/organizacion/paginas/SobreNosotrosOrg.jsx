// src/pages/organizacion/paginas/SobreNosotrosOrg.jsx
import { useOutletContext } from "react-router-dom";

const SobreNosotrosOrg = () => {
  const organizacion = useOutletContext();
  if (!organizacion) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Sobre {organizacion.nombre}</h1>
      <p className="text-gray-600 whitespace-pre-line">
        {organizacion.descripcion ||
          "Esta organización todavía no agregó una descripción."}
      </p>
    </div>
  );
};

export default SobreNosotrosOrg;
