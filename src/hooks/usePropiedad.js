// src/hooks/usePropiedad.js
import { useNavigate } from "react-router-dom";

const usePropiedad = () => {
  //   const { setPropiedades } = useAppContext();
  const navigate = useNavigate();

  const onVer = (id) => navigate(`/inmueble/${id}`);
  const onEditar = (id) => navigate(`/inmueble/${id}/editar`);

  return {
    onEditar,
    onVer,
  };
};

export default usePropiedad;
