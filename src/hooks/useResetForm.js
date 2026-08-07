// hooks/useResetForm.js

import { useAppContext } from "@/context/AppContext";

export const FORM_DATA_PROPIEDAD_INICIAL = {
  tipo: "",
  operacion: "venta",
  operation_type_id: "",
  rental_type_id: "",
  property_type_id: "",
  condition_type_id: "",
  country_id: 0,
  state_id: 0,
  city_id: 0,
  barrio_id: "",
  direccion: "",
  numero_direccion: "",
  latitude: 0,
  longitude: 0,
  titulo: "",
  precio: "",
  administracion: "",
  imagen_principal_url: "",
  imagen_principal_public_id: "",
  estado: "publicado",
  listing_status: "active",
  es_de_organizacion: false,
  organizacion_id: "null",
  publicado_por_id: "",
  estrato: "",
  cedula_catastral: "",
  matricula_inmobiliaria: "",
  description: "",
  constructed_area: "",
  private_area: "",
  plot_area: "",
  room_count: null,
  bedroom_count: null,
  bathroom_count: null,
  social_bathroom_count: null,
  construction_year: "",
  antiguedad_anios: "",
  is_new_construction: false,
  parqueadero_tipo: "",
  parqueadero_modo: "",
  parking_space_count: null,
  parking_space_included: false,
  parking_space_price: "",
  tiene_agua: false,
  tiene_luz: false,
  tiene_gas: false,
  tiene_alcantarillado: false,
  has_elevator: false,
  has_swimming_pool: false,
  has_gym: false,
  has_security_24h: false,
  has_air_conditioning: false,
  is_furnished: false,
  zona: "residencial",
  how_to_contact: "telefono_chat",
  telefono_contacto: "",
  galeria: [{ url: "", publicId: "" }],
};

export const FORM_DATA_USUARIO_INICIAL = {
  name: "",
  email: "",
  password: "",
  telefono: "",
  telefonos: [],
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
