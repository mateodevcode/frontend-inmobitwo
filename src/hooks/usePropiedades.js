// src/hooks/usePropiedades.js
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { useNavigate } from "react-router-dom";
import useResetForm from "@/hooks/useResetForm";
import { apiBackendFormData } from "@/api/apiBackendFormData.js";

const usePropiedades = () => {
  const {
    setPropiedades,
    // refreshPropiedades,
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
    cargandoGlobal,
    setCursor,
    setHasMore,
    cursor,
    hasMore,
    setLoadingPropiedades,
  } = useAppContext();
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
      // DATOS
      // ========================================
      formData.append("titulo", formDataPropiedad.titulo);
      formData.append("estado", formDataPropiedad.estado || "disponible");
      formData.append("publicado_por_id", usuario?.id);

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
  const publicarDataAnuncio = async (e, setLoading) => {
    e.preventDefault();

    try {
      iniciarCarga();
      setLoading(true);
      const formData = new FormData();

      // ========================================
      // DATOS
      // ========================================
      formData.append("tipo", formDataPropiedad.tipo);
      formData.append("operacion", formDataPropiedad.operacion || "venta");
      formData.append("country_id", formDataPropiedad.country_id);
      formData.append("state_id", formDataPropiedad.state_id);
      formData.append("city_id", formDataPropiedad.city_id);
      formData.append("direccion", formDataPropiedad.direccion);
      formData.append("numero_direccion", formDataPropiedad.numero_direccion);
      formData.append("latitude", formDataPropiedad.latitude);
      formData.append("longitude", formDataPropiedad.longitude);
      formData.append("estado", formDataPropiedad.estado || "disponible");
      formData.append("publicado_por_id", usuario?.id);

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

      const data = await apiBackendFormData("/publicar-anuncios", formData);

      const { success, message, error, data: nuevaPropiedad } = data;

      if (success) {
        // await refreshPropiedades();
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
        // await refreshPropiedades();
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

  // --------------------------------
  // cargar propiedades home
  // --------------------------------
  const cargarPropiedades = async () => {
    if (cargandoGlobal || !hasMore) return; // evita pedir doble o pedir cuando ya no hay más
    iniciarCarga();

    try {
      const url = cursor
        ? `/propiedades/inicio?limit=10&cursor=${encodeURIComponent(cursor)}`
        : `/propiedades/inicio?limit=10`;

      // const res = await fetch(url);
      const res = await apiBackend(url);

      if (res.success) {
        setLoadingPropiedades(false);
        setPropiedades((prev) => [...prev, ...res.data.data]); // se acumulan
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      terminarCarga();
    }
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

    // Paso 3: fotos del anuncio
    subirFotosAnuncio,
    continuarSinFotos,

    // Cargar propiedad
    cargarPropiedad,
    cargarPropiedades,
  };
};

export default usePropiedades;
