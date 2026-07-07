// hooks/useResetForm.js

import { useAppContext } from "@/context/AppContext";

const useResetForm = () => {
  const { setFormDataUsuario, setFormDataPropiedad } = useAppContext();

  const resetFormDataUsuario = () => {
    setFormDataUsuario({
      name: "",
      email: "",
      password: "",
      telefono: "",
      rol: "user",
      image_url: null,
      public_id: null,
      email_verificado: false,
    });
  };

  const resetFormDataPropiedad = () => {
    setFormDataPropiedad({
      tipo: "",
      operacion: "",
      country_id: 0,
      state_id: 0,
      city_id: 0,
      direccion: "",
      numero_direccion: "",
      latitude: 0,
      longitude: 0,
      titulo: "",
      imagen_principal_url: "",
      imagen_principal_public_id: "",
      estado: "publicado",
      es_de_organizacion: false,
      organizacion_id: "null",
      publicado_por_id: "",
      galeria: [],
    });
  };

  const resetFormData = () => {
    resetFormDataPropiedad();
    resetFormDataUsuario();
  };

  return {
    resetFormData,
    resetFormDataUsuario,
    resetFormDataPropiedad,
  };
};
export default useResetForm;
