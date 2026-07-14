// hooks/useResetForm.js

import { useAppContext } from "@/context/AppContext";

export const FORM_DATA_PROPIEDAD_INICIAL = {
  tipo: "",
  operacion: "venta",
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
  galeria: [{ url: "", publicId: "" }],
};

export const FORM_DATA_USUARIO_INICIAL = {
  name: "",
  email: "",
  password: "",
  telefono: "",
  rol: "user",
  image_url: null,
  public_id: null,
  email_verificado: false,
};

export function mapearApiAFormDataPropiedad(apiData) {
  const mapped = {};
  for (const key of Object.keys(FORM_DATA_PROPIEDAD_INICIAL)) {
    mapped[key] = apiData[key] ?? FORM_DATA_PROPIEDAD_INICIAL[key];
  }
  return mapped;
}

export function mapearApiAFormDataUsuario(apiData) {
  const mapped = {};
  for (const key of Object.keys(FORM_DATA_USUARIO_INICIAL)) {
    mapped[key] = apiData[key] ?? FORM_DATA_USUARIO_INICIAL[key];
  }
  return mapped;
}

const useResetForm = () => {
  const { setFormDataUsuario, setFormDataPropiedad } = useAppContext();

  const resetFormDataUsuario = () => {
    setFormDataUsuario(FORM_DATA_USUARIO_INICIAL);
  };

  const resetFormDataPropiedad = () => {
    setFormDataPropiedad(FORM_DATA_PROPIEDAD_INICIAL);
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
