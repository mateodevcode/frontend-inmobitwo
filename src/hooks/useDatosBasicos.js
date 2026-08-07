// hooks/useDatosBasicos.js

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useOrganizaciones from "@/hooks/useOrganizaciones";
import { useGeo } from "@/hooks/useGeo";
import { apiBackend } from "@/api/apiBackend";
import {
  PROPERTY_TYPES_DESCRIPCIONES,
  PROPERTY_TYPES_FALLBACK,
  ordenarPropertyTypes,
} from "@/data/property_types";
import {
  OPERATION_OPTIONS,
  OPERATION_TYPE_IDS,
} from "@/data/operation_options";
import {
  RENTAL_TYPE_IDS,
  RENTAL_TYPE_OPTIONS,
} from "@/data/rental_type_options";
import {
  CONTACT_PREFERENCES,
  COUNTRY_CODES,
} from "@/data/contact_options";

const useDatosBasicos = () => {
  const {
    formDataPropiedad,
    setFormDataPropiedad,
    organizaciones,
    confirmedLocation,
    setConfirmedLocation,
    setComprobarDireccion,
    usuario,
    setContentNumber,
  } = useAppContext();
  const { cargarMisOrganizaciones } = useOrganizaciones();

  const [propertyTypes, setPropertyTypes] = useState(PROPERTY_TYPES_FALLBACK);

  useEffect(() => {
    const cargarCatalogos = async () => {
      cargarMisOrganizaciones();
      try {
        const res = await apiBackend("/catalogos/tipos-inmueble");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const deApi = res.data.map((t) => ({
            id: t.id,
            code: t.code,
            label: t.label_es,
            description: PROPERTY_TYPES_DESCRIPCIONES[t.code],
          }));
          const codigosApi = new Set(deApi.map((t) => t.code));
          const faltantes = PROPERTY_TYPES_FALLBACK.filter(
            (t) => !codigosApi.has(t.code),
          );
          setPropertyTypes(ordenarPropertyTypes([...deApi, ...faltantes]));
        }
      } catch {
        // Se mantiene el fallback local
      }
    };
    cargarCatalogos();
  }, [cargarMisOrganizaciones]);

  useEffect(() => {
    console.log("formDataPropiedad (paso 1):", formDataPropiedad);
  }, [formDataPropiedad]);

  const esDeOrganizacion = !!formDataPropiedad?.es_de_organizacion;

  const handleToggleOrganizacion = (checked) => {
    setFormDataPropiedad((prev) => ({
      ...prev,
      es_de_organizacion: checked,
      organizacion_id: checked ? (organizaciones[0]?.id ?? null) : null,
    }));
  };

  // ─────────────────────────────────────────────
  // Operación (venta / alquiler / alquiler vacacional)
  // ─────────────────────────────────────────────
  const esOperacionVacacional =
    formDataPropiedad.operacion === "alquiler" &&
    formDataPropiedad.rental_type_id === RENTAL_TYPE_IDS.vacacional;

  const operacionValue =
    OPERATION_OPTIONS.find(
      (opt) =>
        opt.id ===
        (esOperacionVacacional
          ? "alquiler-vacacional"
          : formDataPropiedad.operacion),
    ) ?? OPERATION_OPTIONS[0];

  useEffect(() => {
    if (
      formDataPropiedad.tipo === "habitacion" &&
      formDataPropiedad.operacion === "venta"
    ) {
      setFormDataPropiedad((prev) => ({ ...prev, operacion: "alquiler" }));
    }
  }, [formDataPropiedad.tipo, formDataPropiedad.operacion, setFormDataPropiedad]);

  const handleChangeOperacion = (selectedOption) => {
    const isVacacional = selectedOption.id === "alquiler-vacacional";
    const operacion = isVacacional ? "alquiler" : selectedOption.id;
    setFormDataPropiedad((prev) => ({
      ...prev,
      operacion,
      operation_type_id: OPERATION_TYPE_IDS[selectedOption.id] || 1,
      rental_type_id: isVacacional
        ? RENTAL_TYPE_IDS.vacacional
        : prev.rental_type_id === RENTAL_TYPE_IDS.vacacional
          ? RENTAL_TYPE_IDS.residencial
          : prev.rental_type_id,
    }));
  };

  const getOperacionDisabled = (opt) =>
    formDataPropiedad.tipo === "habitacion" && opt.id === "venta";

  // ─────────────────────────────────────────────
  // Tipo de alquiler (residencial / temporada / vacacional)
  // ─────────────────────────────────────────────
  const rentalTypeValue =
    RENTAL_TYPE_OPTIONS.find(
      (o) => String(o.id) === String(formDataPropiedad.rental_type_id),
    ) ?? RENTAL_TYPE_OPTIONS[0];

  const handleChangeRentalType = (opt) => {
    setFormDataPropiedad((prev) => ({ ...prev, rental_type_id: opt.id }));
  };

  // ─────────────────────────────────────────────
  // Ubicación del inmueble
  // ─────────────────────────────────────────────
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const { data: countries, loading: loadingCountries } =
    useGeo("/api/countries");

  const { data: states, loading: loadingStates } = useGeo(
    country ? `/api/states?countryId=${country.id}` : null,
  );

  const { data: cities, loading: loadingCities } = useGeo(
    state ? `/api/cities?stateId=${state.id}` : null,
  );

  // Auto-seleccionar Colombia (por ahora solo país activo)
  useEffect(() => {
    if (countries.length > 0 && !country) {
      const colombia = countries.find((c) => c.name === "Colombia");
      if (colombia) {
        const t = setTimeout(() => setCountry(colombia), 0);
        return () => clearTimeout(t);
      }
    }
  }, [countries, country]);

  // Reset en cascada: cambiar país limpia provincia y ciudad
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setState(null);
    setCity(null);
  };

  // Reset en cascada: cambiar provincia limpia ciudad
  const handleStateChange = (newState) => {
    setState(newState);
    setCity(null);
  };

  const handleCityChange = setCity;

  // Persiste la selección geográfica en formDataPropiedad
  useEffect(() => {
    setFormDataPropiedad((prev) => ({
      ...prev,
      country_id: country?.id ?? 0,
      state_id: state?.id ?? 0,
      city_id: city?.id ?? 0,
    }));
  }, [country, state, city, setFormDataPropiedad]);

  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [editPosition, setEditPosition] = useState(null);

  const handleStreetNameChange = (e) => {
    setStreetName(e.target.value);
    setFormDataPropiedad((prev) => ({ ...prev, direccion: e.target.value }));
  };

  const handleStreetNumberChange = (e) => {
    setStreetNumber(e.target.value);
    setFormDataPropiedad((prev) => ({
      ...prev,
      numero_direccion: e.target.value,
    }));
  };

  const handleCheckAddress = async () => {
    if (!country || !state || !city || !streetName.trim()) {
      setCheckError(
        "Completa país, provincia, ciudad y la dirección antes de comprobar.",
      );
      return;
    }

    setCheckError(null);
    setChecking(true);
    setEditPosition(null);

    const fullAddress = [
      `${streetName}${streetNumber ? " " + streetNumber : ""}`,
      city.name,
      state.name,
      country.name,
    ].join(", ");

    const res = await apiBackend(
      `/api/geocode?address=${encodeURIComponent(fullAddress)}`,
      "GET",
    );

    setChecking(false);

    if (res.success) {
      setGeocodeResult(res.data);
    } else {
      setGeocodeResult(null);
    }

    setModalOpen(true);
  };

  const handleConfirmLocation = ({ lat, lng }) => {
    const location = {
      lat,
      lng,
      country,
      state,
      city,
      streetName,
      streetNumber,
    };
    setConfirmedLocation(location);
    setFormDataPropiedad((prev) => ({
      ...prev,
      latitude: lat ?? 0.0,
      longitude: lng ?? 0.0,
    }));
    setComprobarDireccion(true);
    setModalOpen(false);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleEditLocation = () => {
    if (!confirmedLocation) return;
    setEditPosition({ lat: confirmedLocation.lat, lng: confirmedLocation.lng });
    setModalOpen(true);
  };

  // ─────────────────────────────────────────────
  // Contacto (teléfonos del usuario + preferencia del anuncio)
  // ─────────────────────────────────────────────
  const [contactName, setContactName] = useState(() => usuario?.name ?? "");
  const [phones, setPhones] = useState(() => {
    if (usuario?.telefonos?.length) return usuario.telefonos;
    if (usuario?.telefono) return [usuario.telefono];
    return [""];
  });
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [guardandoContacto, setGuardandoContacto] = useState(false);

  const preference =
    CONTACT_PREFERENCES.find(
      (p) => p.id === formDataPropiedad.how_to_contact,
    ) ?? CONTACT_PREFERENCES[0];

  const telefonosValidos = phones.filter((p) => (p ?? "").trim());

  const opcionesTelefono = [
    { id: "all", label: "Todos mis teléfonos" },
    ...telefonosValidos.map((p) => ({ id: p, label: p })),
  ];

  const selectedPhoneValue =
    opcionesTelefono.find(
      (o) => o.id === (formDataPropiedad.telefono_contacto || "all"),
    ) ?? opcionesTelefono[0];

  const handleNameChange = (e) => setContactName(e.target.value);

  const handlePhoneChange = (index, value) =>
    setPhones((prev) => prev.map((p, i) => (i === index ? value : p)));

  const handleAddPhone = () => setPhones((prev) => [...prev, ""]);

  const handleRemovePhone = (index) =>
    setPhones((prev) => prev.filter((_, i) => i !== index));

  const handleCountryCodeChange = (opt) => setCountryCode(opt);

  const handleChangePreference = (opt) =>
    setFormDataPropiedad((prev) => ({ ...prev, how_to_contact: opt.id }));

  const handleChangeSelectedPhone = (opt) =>
    setFormDataPropiedad((prev) => ({
      ...prev,
      telefono_contacto: opt.id === "all" ? "" : opt.id,
    }));

  // Al continuar: PATCH silencioso al usuario con nombre + teléfonos
  const handleContinuarContacto = async () => {
    const numeros = phones
      .map((p) => {
        const t = (p ?? "").trim();
        return t && !t.startsWith("+") ? `${countryCode.code}${t}` : t;
      })
      .filter(Boolean);

    setGuardandoContacto(true);
    if (usuario?.id) {
      try {
        await apiBackend(`/usuarios/${usuario.id}`, "PATCH", {
          name: contactName,
          telefonos: numeros,
        });
      } catch {
        // silencioso: no bloquear el avance
      }
    }
    setGuardandoContacto(false);

    setContentNumber(1);
    document.getElementById("top-detalles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return {
    propertyTypes,
    organizaciones,
    esDeOrganizacion,
    handleToggleOrganizacion,
    operacionValue,
    handleChangeOperacion,
    getOperacionDisabled,
    rentalTypeValue,
    handleChangeRentalType,
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    country,
    state,
    city,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    streetName,
    handleStreetNameChange,
    streetNumber,
    handleStreetNumberChange,
    checkError,
    checking,
    handleCheckAddress,
    confirmedLocation,
    modalOpen,
    handleCloseModal,
    geocodeResult,
    handleConfirmLocation,
    editPosition,
    handleEditLocation,
    usuario,
    contactName,
    handleNameChange,
    phones,
    handlePhoneChange,
    handleAddPhone,
    handleRemovePhone,
    countryCode,
    handleCountryCodeChange,
    preference,
    handleChangePreference,
    opcionesTelefono,
    selectedPhoneValue,
    handleChangeSelectedPhone,
    guardandoContacto,
    handleContinuarContacto,
  };
};

export default useDatosBasicos;
