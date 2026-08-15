// src/hooks/usePropiedades.js
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import useResetForm from "@/hooks/useResetForm";
import { apiBackendFormData } from "@/api/apiBackendFormData.js";
import { feedActions, getFeedSnapshot } from "@/hooks/feedStore";
import {
  guardarProgreso,
  leerProgreso,
  limpiarTodo,
  PASO_FOTOS,
} from "@/pages/publicar-anuncio/anuncioProgreso";

// Caché a nivel de módulo de GET /propiedades/:id. Se invalida tras PATCH/POST/DELETE.
const propiedadCache = new Map();

// Caché del contador de "mis anuncios" (badge del menú de usuario).
// El endpoint devuelve la lista completa, así que solo se pide cada TTL.
const COUNT_TTL = 30 * 1000;
let countMisAnunciosCache = { key: null, count: 0, ts: 0 };

const invalidarCountMisAnuncios = () => {
  countMisAnunciosCache = { key: null, count: 0, ts: 0 };
};

// Lista de campos del schema v5.0 (Colombia).
const CAMPOS_PROPIEDAD = [
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

// Devuelve un objeto con solo los campos llenos (omite ""/null/undefined).
// Se usa tanto para el FormData de creación como para el PATCH de actualización.
function camposPropiedad(datos) {
  const resultado = {};
  for (const campo of CAMPOS_PROPIEDAD) {
    const valor = datos?.[campo];
    if (valor === undefined || valor === null || valor === "") continue;
    if (campo === "latitude" || campo === "longitude") {
      const limpio = normalizarCoord(valor);
      if (limpio === null) continue;
      resultado[campo] = limpio;
      continue;
    }
    resultado[campo] = valor;
  }
  return resultado;
}

// Agrega a un FormData todos los campos del schema v5.0 (Colombia).
function appendCamposPropiedad(formData, datos) {
  for (const [campo, valor] of Object.entries(camposPropiedad(datos))) {
    formData.append(campo, valor);
  }
}

const usePropiedades = () => {
  const {
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
  } = useAppContext();
  const cargandoPropiedades = useRef(false);
  const cargandoPropiedadesInicio = useRef(false);
  const enviandoAnuncio = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  // Si ya existe un anuncio (URL ?id o progreso guardado) ACTUALIZA (PATCH).
  // Si no existe, CREA (POST /publicar-anuncios) y guarda el id para el paso 3.
  // ok loader
  // ─────────────────────────────────────────────
  const publicarDataAnuncio = async (e, setLoading, caracteristicasSeleccionadas = []) => {
    e.preventDefault();

    // Protección anti doble-click: si ya hay una petición en curso, ignorar.
    if (enviandoAnuncio.current) return;
    enviandoAnuncio.current = true;

    try {
      iniciarCarga();
      setLoading(true);

      // Resuelve el id del anuncio: URL > progreso guardado > ninguno (crear).
      const idEnUrl = searchParams.get("id");
      const anuncioId = idEnUrl ?? leerProgreso()?.id ?? null;

      // Datos del wizard (schema v5.0) en un objeto plano reutilizable.
      const cuerpo = camposPropiedad(formDataPropiedad);
      cuerpo.estado = formDataPropiedad.estado || "publicado";
      cuerpo.publicado_por_id = usuario?.id;
      if (
        formDataPropiedad.organizacion_id &&
        formDataPropiedad.organizacion_id !== "null"
      ) {
        cuerpo.organizacion_id = formDataPropiedad.organizacion_id;
      }
      if (formDataPropiedad.es_de_organizacion) {
        cuerpo.es_de_organizacion = formDataPropiedad.es_de_organizacion;
      }

      const guardarCaracteristicas = async (propiedadId) => {
        if (!propiedadId) return;
        try {
          await apiBackend(
            `/propiedades/${propiedadId}/caracteristicas`,
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
      };

      // ========================================
      // MODO ACTUALIZAR (la propiedad ya existe)
      // ========================================
      if (anuncioId) {
        const data = await apiBackend(`/propiedades/${anuncioId}`, "PATCH", cuerpo);
        const { success, message, error } = data;

        if (!success) {
          console.warn("⚠️ Error:", error);
          return;
        }

        propiedadCache.delete(anuncioId);
        await guardarCaracteristicas(anuncioId);
        toast.success(message || "Anuncio actualizado", {
          position: "bottom-right",
        });

        guardarProgreso({ id: anuncioId, step: PASO_FOTOS });
        setContentNumber(2);

        // Si el id venía solo del storage (sin ?id en la URL), normalizar la URL.
        if (!idEnUrl) {
          navigate(`/info/publicar-anuncio/publicar?id=${anuncioId}`, {
            replace: true,
          });
        }
        return;
      }

      // ========================================
      // MODO CREAR
      // ========================================
      const formData = new FormData();
      for (const [campo, valor] of Object.entries(cuerpo)) {
        formData.append(campo, valor);
      }

      const data = await apiBackendFormData("/publicar-anuncios", formData);

      const { success, message, error, data: nuevaPropiedad } = data;

      if (success) {
        await guardarCaracteristicas(nuevaPropiedad?.id);
        toast.success(message);
        resetFormDataPropiedad();
        setOpenModalAgregarPropiedad(false);
        setContentNumber(2);

        guardarProgreso({ id: nuevaPropiedad.id, step: PASO_FOTOS });
        navigate(`/info/publicar-anuncio/publicar?id=${nuevaPropiedad.id}`);
      } else {
        console.warn("⚠️ Error:", error);
        // toast.error(error || message, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error creando la propiedad", { position: "bottom-right" });
    } finally {
      enviandoAnuncio.current = false;
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
        propiedadCache.delete(id);
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
        propiedadCache.delete(propiedadId);
        feedActions.setPropiedades((prev) =>
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
    if (!anuncioId) {
      toast.error("No se encontró el anuncio para subir las fotos", {
        position: "bottom-right",
      });
      return { success: false };
    }

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
        propiedadCache.delete(anuncioId);
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
    limpiarTodo();
    resetFormDataPropiedad();
    setContentNumber(0);
    navigate("/usuario/mis-anuncios", { replace: true });
  };

  // --------------------------------
  // cargar propiedad
  // --------------------------------
  const cargarPropiedad = async (anuncioId) => {
    if (propiedadCache.has(anuncioId)) {
      setPropiedad(propiedadCache.get(anuncioId));
      return;
    }
    try {
      iniciarCarga();
      const res = await apiBackend(`/propiedades/${anuncioId}`);
      const { success, data } = res;
      if (success) {
        propiedadCache.set(anuncioId, data);
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
    feedActions.reset();
  };

  // --------------------------------
  // cargar propiedades home
  // --------------------------------
  const cargarPropiedades = async () => {
    const { cursor, hasMore } = getFeedSnapshot();
    if (cargandoPropiedades.current || !hasMore) return;
    cargandoPropiedades.current = true;
    feedActions.setCargandoMas(true);

    try {
      const url = cursor
        ? `/propiedades/inicio?limit=10&cursor=${encodeURIComponent(cursor)}`
        : `/propiedades/inicio?limit=10`;

      const res = await apiBackend(url);

      if (res.success) {
        feedActions.setLoading(false);
        feedActions.setPropiedades((prev) => {
          const combinadas = [...prev, ...res.data.data];
          return Array.from(new Map(combinadas.map((p) => [p.id, p])).values());
        });
        feedActions.setCursor(res.data.pagination.nextCursor);
        feedActions.setHasMore(res.data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      cargandoPropiedades.current = false;
      feedActions.setCargandoMas(false);
    }
  };

  const cargarPropiedadesInicio = async () => {
    if (cargandoPropiedadesInicio.current) return;
    cargandoPropiedadesInicio.current = true;

    try {
      const url = `/propiedades/inicio?limit=10`;

      const res = await apiBackend(url);

      if (res.success) {
        feedActions.setLoading(false);
        feedActions.setPropiedades((prev) => {
          const combinadas = [...prev, ...res.data.data];
          return Array.from(new Map(combinadas.map((p) => [p.id, p])).values());
        });
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      cargandoPropiedadesInicio.current = false;
    }
  };

  const cargarPropiedadesMisAnuncios = async () => {
    limpiarPropiedades();
    invalidarCountMisAnuncios();

    try {
      const url = `/propiedades/mis-anuncios?id=${usuario.id}`;

      const res = await apiBackend(url);

      if (res.success) {
        feedActions.setLoading(false);
        feedActions.setPropiedades(res.data);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    }
  };

  const cargarCountMisAnuncios = useCallback(async () => {
    const key = usuario?.id ?? "anon";
    if (
      countMisAnunciosCache.key === key &&
      Date.now() - countMisAnunciosCache.ts < COUNT_TTL
    ) {
      return countMisAnunciosCache.count;
    }
    try {
      const res = await apiBackend("/propiedades/mis-anuncios/count");
      if (res.success) {
        countMisAnunciosCache = {
          key,
          count: res.data,
          ts: Date.now(),
        };
        return countMisAnunciosCache.count;
      }
      return 0;
    } catch (error) {
      console.error("Error cargando count mis anuncios:", error);
      return 0;
    }
  }, [usuario?.id]);

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
