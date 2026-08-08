// src/hooks/usePropiedades.js
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { useNavigate } from "react-router-dom";
import useResetForm from "@/hooks/useResetForm";
import { apiBackendFormData } from "@/api/apiBackendFormData.js";

// Agrega a un FormData todos los campos del schema v5.0 (Colombia).
// Omite valores vacíos para no enviar "0" o "" innecesarios al backend.
function appendCamposPropiedad(formData, datos) {
  // Normaliza coordenadas: si llegan como array o string de Postgres "{a,b}",
  // toma el primer valor numérico. Evita 500 en el INSERT.
  const normalizarCoord = (v) => {
    if (v === undefined || v === null || v === "") return null;
    let valor = v;
    if (Array.isArray(valor)) valor = valor[0];
    if (typeof valor === "string" && valor.startsWith("{")) {
      const match = valor.match(/[-\d.]+/);
      valor = match?.[0];
    }
    const n = Number(valor);
    return isNaN(n) ? null : n;
  };

  const campos = [
    "operation_type_id",
    "property_type_id",
    "condition_type_id",
    "rental_type_id",
    "country_id",
    "state_id",
    "city_id",
    "barrio_id",
    "barrio_nombre",
    "direccion",
    "numero_direccion",
    "latitude",
    "longitude",
    "estrato",
    "cedula_catastral",
    "matricula_inmobiliaria",
    "description",
    "precio",
    "administracion",
    "constructed_area",
    "private_area",
    "plot_area",
    "room_count",
    "bedroom_count",
    "bathroom_count",
    "social_bathroom_count",
    "construction_year",
    "antiguedad_anios",
    "is_new_construction",
    "parqueadero_tipo",
    "parqueadero_modo",
    "parking_space_count",
    "parking_space_included",
    "parking_space_price",
    "tiene_agua",
    "tiene_luz",
    "tiene_gas",
    "tiene_alcantarillado",
    "has_elevator",
    "has_swimming_pool",
    "has_gym",
    "has_security_24h",
    "has_air_conditioning",
    "is_furnished",
    "zona",
    "how_to_contact",
    "telefono_contacto",
  ];
  for (const campo of campos) {
    const valor = datos?.[campo];
    if (valor === undefined || valor === null || valor === "") continue;
    if (campo === "latitude" || campo === "longitude") {
      const limpio = normalizarCoord(valor);
      if (limpio === null) continue;
      formData.append(campo, limpio);
      continue;
    }
    formData.append(campo, valor);
  }
}

const usePropiedades = () => {
  const {
    setPropiedades,
    formDataPropiedad,
    usuario,
    setFormDataPropiedad,
    setOpenModalAgregarPropiedad,
    setOpenModalConfirmarEliminarPropiedad,
    setPropiedadAEliminar,
    setEliminandoPropiedad,
    iniciarCarga,
    terminarCarga,
    setContentNumber,
    setPropiedad,
    cursor,
    hasMore,
    setLoadingPropiedades,
    setCursor,
    setHasMore,
  } = useAppContext();
  const cargandoPropiedades = useRef(false);
  const cargandoPropiedadesInicio = useRef(false);
  const navigate = useNavigate();
  const { resetFormDataPropiedad } = useResetForm();

  // ─────────────────────────────────────────────
  // Crear propiedad (con imágenes — usa FormData, no apiBackend)
  // ok loader
  // ─────────────────────────────────────────────
  const crearPropiedad = async (
    e,
    setLoading,
    setFile,
    setPreview,
    imagenPrincipal,
    galeriaFiles,
    setGaleriaFiles,
    setGaleriaPreviews,
    planosFiles,
    setPlanosFiles,
    setPlanosPreviews,
  ) => {
    e.preventDefault();

    if (!imagenPrincipal) {
      toast.error("La imagen principal es requerida", {
        position: "bottom-right",
      });
      return;
    }

    if (!formDataPropiedad.titulo) {
      toast.error("El título es requerido", { position: "bottom-right" });
      return;
    }

    try {
      iniciarCarga();
      setLoading(true);
      const formData = new FormData();

      // ========================================
      // IMAGEN PRINCIPAL
      // ========================================
      formData.append("imagenPrincipal", imagenPrincipal);

      // ========================================
      // IMÁGENES DE GALERÍA
      // ========================================
      if (galeriaFiles && galeriaFiles.length > 0) {
        galeriaFiles.forEach((file) => {
          formData.append("galeria", file);
        });
      }

      // ========================================
      // PLANOS
      // ========================================
      if (planosFiles && planosFiles.length > 0) {
        planosFiles.forEach((file) => {
          formData.append("planos", file);
        });
      }

      // ========================================
      // DATOS
      // ========================================
      formData.append("titulo", formDataPropiedad.titulo);
      formData.append("estado", formDataPropiedad.estado || "publicado");
      formData.append("publicado_por_id", usuario?.id);
      appendCamposPropiedad(formData, formDataPropiedad);

      if (
        formDataPropiedad.organizacion_id &&
        formDataPropiedad.organizacion_id !== "null"
      ) {
        formData.append("organizacion_id", formDataPropiedad.organizacion_id);
      }

      if (formDataPropiedad.es_de_organizacion) {
        formData.append(
          "es_de_organizacion",
          formDataPropiedad.es_de_organizacion,
        );
      }

      const data = await apiBackendFormData("/propiedades", formData);

      const { success, message, error } = data;

      if (success) {
        toast.success(message, { position: "bottom-right" });
        // await refreshPropiedades();

        resetFormDataPropiedad();
        setFile(null);
        setPreview(null);
        setGaleriaFiles([]);
        setGaleriaPreviews([]);
        setPlanosFiles && setPlanosFiles([]);
        setPlanosPreviews && setPlanosPreviews([]);
        setOpenModalAgregarPropiedad(false);

        navigate(`/`);
      } else {
        console.warn("⚠️ Error:", error);
        toast.error(error || message, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error creando la propiedad", { position: "bottom-right" });
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Publicar un anuncio
  // ok loader
  // pendiente de revision
  // ─────────────────────────────────────────────
  const publicarDataAnuncio = async (e, setLoading, caracteristicasSeleccionadas = []) => {
    e.preventDefault();

    try {
      iniciarCarga();
      setLoading(true);
      const formData = new FormData();

      // ========================================
      // DATOS (schema v5.0: IDs de catálogos + campos Colombia)
      // appendCamposPropiedad agrega todos los campos del formulario.
      // Solo se agregan aquí los que NO están en esa lista.
      // ========================================
      formData.append("estado", formDataPropiedad.estado || "publicado");
      formData.append("publicado_por_id", usuario?.id);
      appendCamposPropiedad(formData, formDataPropiedad);

      if (
        formDataPropiedad.organizacion_id &&
        formDataPropiedad.organizacion_id !== "null"
      ) {
        formData.append("organizacion_id", formDataPropiedad.organizacion_id);
      }

      if (formDataPropiedad.es_de_organizacion) {
        formData.append(
          "es_de_organizacion",
          formDataPropiedad.es_de_organizacion,
        );
      }

      console.log("[publicar] lat/lng:", formDataPropiedad.latitude, formDataPropiedad.longitude);
      const data = await apiBackendFormData("/publicar-anuncios", formData);

      const { success, message, error, data: nuevaPropiedad } = data;

      if (success) {
        // Características N:M (feature_catalog) — segunda llamada
        if (nuevaPropiedad?.id && caracteristicasSeleccionadas.length > 0) {
          try {
            await apiBackend(
              `/propiedades/${nuevaPropiedad.id}/caracteristicas`,
              "POST",
              {
                features: caracteristicasSeleccionadas.map((id) => ({
                  feature_id: id,
                  bool_value: true,
                })),
              },
            );
          } catch (featError) {
            console.warn("⚠️ No se guardaron las características:", featError);
          }
        }

        toast.success(message);
        resetFormDataPropiedad();
        setOpenModalAgregarPropiedad(false);
        setContentNumber(2);

        localStorage.setItem(
          "ultimoAnuncioId",
          JSON.stringify({
            id: nuevaPropiedad.id,
            timestamp: new Date().toISOString(),
          }),
        );

        navigate(`/info/publicar-anuncio/publicar?id=${nuevaPropiedad.id}`);
      } else {
        console.warn("⚠️ Error:", error);
        // toast.error(error || message, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error creando la propiedad", { position: "bottom-right" });
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Actualizar propiedad
  // ─────────────────────────────────────────────
  const actualizarPropiedad = async (e, id, setLoading, formData) => {
    e.preventDefault();

    try {
      iniciarCarga();
      setLoading(true);

      // ========================================
      // DATOS
      // ========================================

      const data = await apiBackend(`/propiedades/${id}`, "PATCH", formData);

      const { success, message, error } = data;

      if (success) {
        await cargarPropiedadesMisAnuncios();
        toast.success(message);
        resetFormDataPropiedad();
      } else {
        console.warn("⚠️ Error:", error);
        // toast.error(error || message, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error creando la propiedad", { position: "bottom-right" });
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ========================================
  // ELIMINAR PROPIEDAD COMPLETA
  // ok loader
  // ========================================
  const eliminarPropiedad = async (propiedadId) => {
    if (!propiedadId) {
      toast.error("ID de propiedad requerido", { position: "bottom-right" });
      return;
    }

    try {
      iniciarCarga();
      setEliminandoPropiedad(true);

      const res = await apiBackend(`/propiedades/${propiedadId}`, "DELETE", {
        id_usuario: usuario.id,
      });

      const { success, message, error } = res;

      if (success) {
        setPropiedades((prev) =>
          prev.filter((propiedad) => propiedad.id !== propiedadId),
        );

        toast.success(message, {
          position: "bottom-right",
        });
      } else {
        console.warn("⚠️ Error al eliminar:", error);
        toast.error("No se pudo eliminar la propiedad", {
          description: error || message,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("🚨 Error al eliminar la propiedad:", error);
      toast.error("Error eliminando la propiedad", {
        position: "bottom-right",
      });
    } finally {
      terminarCarga();
      setEliminandoPropiedad(false);
      setOpenModalConfirmarEliminarPropiedad(false);
      setPropiedadAEliminar(null);
    }
  };

  // ========================================
  // ELIMINAR PREVIEW DE GALERÍA NUEVA
  // ========================================
  const handleDeletePreviewImage = (
    index,
    setGaleriaFiles,
    setGaleriaPreviews,
  ) => {
    setGaleriaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setGaleriaPreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  // ========================================
  // HANDLE CHANGE GALERÍA (MÚLTIPLES)
  // ========================================
  const handleChangeMultipleFiles = (
    e,
    setGaleriaFiles,
    setGaleriaPreviews,
  ) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const validFiles = [];
    const newPreviews = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} no es una imagen`, {
          position: "bottom-right",
        });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} pesa más de 10MB`, {
          position: "bottom-right",
        });
        continue;
      }
      validFiles.push(file);
      newPreviews.push({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (validFiles.length === 0) return;

    setGaleriaFiles((prevFiles) => {
      const totalFiles = prevFiles.length + validFiles.length;
      if (totalFiles > 10) {
        toast.error(`Máximo 10 imágenes permitidas (intentas ${totalFiles})`, {
          position: "bottom-right",
        });
        return prevFiles;
      }
      return [...prevFiles, ...validFiles];
    });

    setGaleriaPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // ========================================
  // HANDLE CHANGE IMAGEN PRINCIPAL
  // ========================================
  const handleChangeFile = (e, setFile, setPreview) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("El archivo pesa más de 10MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ========================================
  // HANDLE CHANGE CAMPOS TEXTO
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataPropiedad((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ─────────────────────────────────────────────
  // Subir fotos al anuncio ya creado (paso 3 del wizard)
  // PATCH /propiedades/:id — usa apiBackendFormData
  // ─────────────────────────────────────────────
  const subirFotosAnuncio = async (
    anuncioId,
    setLoading,
    imagenPrincipal,
    galeriaFiles,
    planosFiles,
  ) => {
    try {
      iniciarCarga();
      setLoading(true);

      const formData = new FormData();

      if (imagenPrincipal) {
        formData.append("imagenPrincipal", imagenPrincipal);
      }

      if (galeriaFiles && galeriaFiles.length > 0) {
        galeriaFiles.forEach((file) => {
          formData.append("galeria", file);
        });
      }

      if (planosFiles && planosFiles.length > 0) {
        planosFiles.forEach((file) => {
          formData.append("planos", file);
        });
      }

      const data = await apiBackendFormData(
        `/propiedades/${anuncioId}`,
        formData,
        "PATCH",
      );

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Fotos guardadas correctamente", {
          position: "bottom-right",
        });
        // await refreshPropiedades();
        finalizarPublicacion();
        return { success: true };
      } else {
        console.warn("⚠️ Error:", error);
        toast.error(error || message, { position: "bottom-right" });
        return { success: false };
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error subiendo las fotos", { position: "bottom-right" });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Continuar sin fotos: cierra el wizard tal cual está
  // (no hace PATCH, no hay nada que actualizar)
  // ─────────────────────────────────────────────
  const continuarSinFotos = () => {
    finalizarPublicacion();
  };

  // ─────────────────────────────────────────────
  // Limpieza común al terminar el wizard (con o sin fotos)
  // ─────────────────────────────────────────────
  const finalizarPublicacion = () => {
    localStorage.removeItem("ultimoAnuncioId");
    resetFormDataPropiedad();
    setContentNumber(0);
    navigate("/usuario/mis-anuncios", { replace: true });
  };

  // --------------------------------
  // cargar propiedad
  // --------------------------------
  const cargarPropiedad = async (anuncioId) => {
    try {
      iniciarCarga();
      const res = await apiBackend(`/propiedades/${anuncioId}`);
      const { success, data } = res;
      if (success) {
        setPropiedad(data);
      }
    } catch (error) {
      console.error("Error cargando propiedad:", error);
    } finally {
      terminarCarga();
    }
  };

  // Limpiar pripiedades

  const limpiarPropiedades = () => {
    setPropiedades([]);
    setCursor(null);
    setHasMore(true);
  };

  // --------------------------------
  // cargar propiedades home
  // --------------------------------
  const cargarPropiedades = async () => {
    if (cargandoPropiedades.current || !hasMore) return;
    cargandoPropiedades.current = true;
    iniciarCarga();

    try {
      const url = cursor
        ? `/propiedades/inicio?limit=10&cursor=${encodeURIComponent(cursor)}`
        : `/propiedades/inicio?limit=10`;

      const res = await apiBackend(url);

      if (res.success) {
        setLoadingPropiedades(false);
        setPropiedades((prev) => {
          const combinadas = [...prev, ...res.data.data];
          return Array.from(new Map(combinadas.map((p) => [p.id, p])).values());
        });
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      cargandoPropiedades.current = false;
      terminarCarga();
    }
  };

  const cargarPropiedadesInicio = async () => {
    if (cargandoPropiedadesInicio.current) return;
    cargandoPropiedadesInicio.current = true;
    iniciarCarga();

    try {
      const url = `/propiedades/inicio?limit=10`;

      const res = await apiBackend(url);

      if (res.success) {
        setLoadingPropiedades(false);
        setPropiedades((prev) => {
          const combinadas = [...prev, ...res.data.data];
          return Array.from(new Map(combinadas.map((p) => [p.id, p])).values());
        });
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      cargandoPropiedadesInicio.current = false;
      terminarCarga();
    }
  };

  const cargarPropiedadesMisAnuncios = async () => {
    limpiarPropiedades();
    iniciarCarga();

    try {
      const url = `/propiedades/mis-anuncios?id=${usuario.id}`;

      const res = await apiBackend(url);

      if (res.success) {
        setLoadingPropiedades(false);
        setPropiedades(res.data);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      terminarCarga();
    }
  };

  const cargarCountMisAnuncios = useCallback(async () => {
    try {
      const res = await apiBackend("/propiedades/mis-anuncios");
      if (res.success) return res.data.length;
      return 0;
    } catch (error) {
      console.error("Error cargando count mis anuncios:", error);
      return 0;
    }
  }, []);

  // --------------------------------
  // Características N:M (feature_catalog)
  // --------------------------------
  const cargarCaracteristicasPropiedad = async (propiedadId) => {
    try {
      const res = await apiBackend(`/propiedades/${propiedadId}/caracteristicas`);
      return res.data || {};
    } catch (error) {
      console.error("Error cargando características:", error);
      return {};
    }
  };

  const guardarCaracteristicasPropiedad = async (propiedadId, features) => {
    const res = await apiBackend(
      `/propiedades/${propiedadId}/caracteristicas`,
      "POST",
      { features },
    );
    return res;
  };

  return {
    actualizarPropiedad,
    eliminarPropiedad,
    crearPropiedad,
    handleDeletePreviewImage,
    handleChangeMultipleFiles,
    handleChangeFile,
    handleChange,
    publicarDataAnuncio,

    // Características N:M
    cargarCaracteristicasPropiedad,
    guardarCaracteristicasPropiedad,

    // Paso 3: fotos del anuncio
    subirFotosAnuncio,
    continuarSinFotos,

    // Cargar propiedad
    cargarPropiedad,
    cargarPropiedades,
    cargarPropiedadesInicio,
    cargarPropiedadesMisAnuncios,
    cargarCountMisAnuncios,
    limpiarPropiedades,
  };
};

export default usePropiedades;
