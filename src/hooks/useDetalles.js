// hooks/useDetalles.js

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import usePropiedades from "@/hooks/usePropiedades";
import { apiBackend } from "@/api/apiBackend";

// ─────────────────────────────────────────────
// Caché a nivel de módulo: los catálogos y el título se piden UNA sola vez
// aunque useDetalles se instancie en varios bloques.
// ─────────────────────────────────────────────
let catalogoCache = null;
let catalogoPromise = null;

function cargarCatalogos() {
  if (catalogoCache) return Promise.resolve(catalogoCache);
  if (!catalogoPromise) {
    catalogoPromise = Promise.all([
      apiBackend("/catalogos/estados"),
      apiBackend("/catalogos/caracteristicas"),
    ])
      .then(([estados, feats]) => {
        catalogoCache = {
          conditionTypes: estados.success ? estados.data : [],
          features: feats.success ? feats.data : {},
        };
        return catalogoCache;
      })
      .finally(() => {
        catalogoPromise = null;
      });
  }
  return catalogoPromise;
}

let tituloCache = { key: "", promise: null, titulo: "" };

function getTituloSugerido(key, url) {
  if (tituloCache.key === key && tituloCache.titulo) {
    return Promise.resolve(tituloCache.titulo);
  }
  if (tituloCache.key === key && tituloCache.promise) {
    return tituloCache.promise;
  }
  const p = apiBackend(url)
    .then((res) => {
      const t = res.success && res.data?.titulo ? res.data.titulo : "";
      // Solo se cachea un título válido; si falló, se reintentará.
      tituloCache = t
        ? { key, promise: null, titulo: t }
        : { key: "", promise: null, titulo: "" };
      return t;
    })
    .catch(() => {
      tituloCache = { key: "", promise: null, titulo: "" };
      return "";
    });
  tituloCache = { key, promise: p, titulo: "" };
  return p;
}

const useDetalles = ({ calcularPrecio = false } = {}) => {
  const { formDataPropiedad, setFormDataPropiedad } = useAppContext();
  const { publicarDataAnuncio } = usePropiedades();

  const [conditionTypes, setConditionTypes] = useState([]);
  const [features, setFeatures] = useState({});
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  // Características N:M seleccionadas (ids de feature_catalog)
  const [featuresSel, setFeaturesSel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [precioSugerido, setPrecioSugerido] = useState(null);
  const [descripcionesIA, setDescripcionesIA] = useState(null);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [tituloGenerado, setTituloGenerado] = useState("");

  useEffect(() => {
    let activo = true;
    cargarCatalogos()
      .then((cache) => {
        if (!activo) return;
        setConditionTypes(cache.conditionTypes);
        setFeatures(cache.features);
        setCargandoCatalogos(false);
      })
      .catch(() => {
        if (activo) setCargandoCatalogos(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    console.log("formDataPropiedad (paso 2):", formDataPropiedad);
  }, [formDataPropiedad]);

  const setCampo = (campo) => (valor) =>
    setFormDataPropiedad((prev) => ({ ...prev, [campo]: valor }));

  // ─────────────────────────────────────────────
  // Año ↔ Antigüedad (se calculan entre sí)
  // ─────────────────────────────────────────────
  const anioActual = new Date().getFullYear();

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormDataPropiedad((prev) => ({
      ...prev,
      construction_year: year,
      antiguedad_anios:
        year && Number(year) >= 1900 && Number(year) <= anioActual
          ? anioActual - Number(year)
          : prev.antiguedad_anios,
    }));
  };

  const handleAntiguedadChange = (anios) => {
    setFormDataPropiedad((prev) => ({
      ...prev,
      antiguedad_anios: anios,
      construction_year:
        anios != null && anios !== ""
          ? anioActual - Number(anios)
          : prev.construction_year,
    }));
  };

  // ─────────────────────────────────────────────
  // Características N:M + envío del anuncio
  // ─────────────────────────────────────────────
  const toggleFeature = (id, checked) =>
    setFeaturesSel((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );

  const onSubmit = (e) => {
    publicarDataAnuncio(e, setLoading, featuresSel);
    document.getElementById("top-detalles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ─────────────────────────────────────────────
  // Generador de título y descripción con IA
  // ─────────────────────────────────────────────
  const generarDescripcionesIA = async () => {
    setGenerandoIA(true);
    try {
      const area =
        Number(formDataPropiedad.private_area) ||
        Number(formDataPropiedad.constructed_area) ||
        0;
      const res = await apiBackend("/ia/generar-descripcion", "POST", {
        property_type_id: formDataPropiedad.property_type_id,
        operacion: formDataPropiedad.operacion,
        city_id: formDataPropiedad.city_id,
        barrio: formDataPropiedad.barrio_nombre,
        estrato: formDataPropiedad.estrato,
        private_area: formDataPropiedad.private_area,
        constructed_area: formDataPropiedad.constructed_area,
        bedroom_count: formDataPropiedad.bedroom_count,
        bathroom_count: formDataPropiedad.bathroom_count,
        social_bathroom_count: formDataPropiedad.social_bathroom_count,
        condition_type_id: formDataPropiedad.condition_type_id,
        floor: formDataPropiedad.floor,
        interior: formDataPropiedad.interior_apartment_number,
        parqueadero_tipo: formDataPropiedad.parqueadero_tipo,
        parqueadero_modo: formDataPropiedad.parqueadero_modo,
        administracion: formDataPropiedad.administracion,
        features: featuresSel,
        servicios: {
          agua: !!formDataPropiedad.tiene_agua,
          luz: !!formDataPropiedad.tiene_luz,
          gas: !!formDataPropiedad.tiene_gas,
          alcantarillado: !!formDataPropiedad.tiene_alcantarillado,
        },
        precio: formDataPropiedad.precio,
        price_per_sqm:
          formDataPropiedad.precio && area
            ? Math.round(Number(formDataPropiedad.precio) / area)
            : 0,
        zona: formDataPropiedad.zona,
      });

      if (res.success && res.data?.formatos) {
        setDescripcionesIA(res.data);
      } else {
        toast.error(res.error || "No se pudo generar la descripción", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error generando descripción:", error);
      toast.error("Error generando la descripción con IA", {
        position: "bottom-right",
      });
    } finally {
      setGenerandoIA(false);
    }
  };

  const usarDescripcionIA = (texto) =>
    setFormDataPropiedad((prev) => ({ ...prev, description: texto }));

  // ─────────────────────────────────────────────
  // Título generado por el backend (misma fórmula que publicarAnuncios).
  // Se genera una sola vez por combinación de datos (caché a nivel de módulo).
  // ─────────────────────────────────────────────
  useEffect(() => {
    const { city_id, state_id, property_type_id, direccion, operacion } =
      formDataPropiedad;
    console.log("[titulo] datos:", {
      city_id,
      state_id,
      property_type_id,
      direccion,
      operacion,
    });
    let activo = true;

    // Todos los datos necesarios (la dirección es el último en llenarse)
    if (!city_id || !state_id || !property_type_id || !direccion || !operacion) {
      console.log("[titulo] FALTAN DATOS:", {
        falta_city: !city_id,
        falta_state: !state_id,
        falta_type: !property_type_id,
        falta_direccion: !direccion,
        falta_operacion: !operacion,
      });
      const t = setTimeout(() => {
        if (activo) setTituloGenerado("");
      }, 0);
      return () => {
        activo = false;
        clearTimeout(t);
      };
    }

    const key = `${property_type_id}|${city_id}|${state_id}|${direccion ?? ""}|${operacion}`;
    const url = `/api/titulo-sugerido?propertyTypeId=${property_type_id}&cityId=${city_id}&stateId=${state_id}&direccion=${encodeURIComponent(
      direccion ?? "",
    )}&operacion=${encodeURIComponent(operacion)}`;
    console.log("[titulo] pidiendo:", url);

    getTituloSugerido(key, url).then((t) => {
      console.log("[titulo] resultado:", t);
      if (activo) setTituloGenerado(t);
    });

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formDataPropiedad.city_id,
    formDataPropiedad.state_id,
    formDataPropiedad.property_type_id,
    formDataPropiedad.direccion,
    formDataPropiedad.operacion,
  ]);

  // ─────────────────────────────────────────────
  // Precio sugerido (solo si se pide el cálculo)
  // ─────────────────────────────────────────────
  const codesDeFeatures = Object.values(features)
    .flat()
    .filter((f) => featuresSel.includes(f.id))
    .map((f) => f.code);

  useEffect(() => {
    if (!calcularPrecio) return;
    // El algoritmo necesita un área para calcular; si no hay, no llamamos.
    const tieneArea =
      Number(formDataPropiedad.private_area) ||
      Number(formDataPropiedad.constructed_area);
    if (!tieneArea) {
      const t = setTimeout(() => setPrecioSugerido(null), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      apiBackend("/propiedades/calcular-precio-sugerido", "POST", {
        city_id: formDataPropiedad.city_id || undefined,
        estrato: formDataPropiedad.estrato || undefined,
        private_area: formDataPropiedad.private_area || undefined,
        constructed_area: formDataPropiedad.constructed_area || undefined,
        condition_type_id: formDataPropiedad.condition_type_id || undefined,
        construction_year: formDataPropiedad.construction_year || undefined,
        floor: formDataPropiedad.floor || undefined,
        features: codesDeFeatures,
        parqueadero_tipo: formDataPropiedad.parqueadero_tipo || undefined,
        parqueadero_modo: formDataPropiedad.parqueadero_modo || undefined,
        zona: formDataPropiedad.zona || undefined,
      })
        .then((res) => {
          if (res.success && res.data && !res.data.error) {
            setPrecioSugerido(res.data);
          } else {
            setPrecioSugerido(null);
          }
        })
        .catch(() => setPrecioSugerido(null));
    }, 600);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcularPrecio, formDataPropiedad, codesDeFeatures.join(",")]);

  // Indicador de posición del precio del usuario vs el sugerido
  const validacionPrecio = (() => {
    const promedio = precioSugerido?.precio_sugerido_promedio;
    const p = Number(formDataPropiedad.precio);
    if (!promedio || !p) return null;
    const diff = ((p - promedio) / promedio) * 100;

    if (diff > 25) {
      return {
        nivel: "sobrevalorado",
        mensaje: `⚠️ ${Math.round(diff)}% sobre el mercado. Considera ajustar.`,
      };
    }
    if (diff > 15) {
      return {
        nivel: "alto",
        mensaje: `🟡 ${Math.round(diff)}% sobre el mercado. Aceptable con diferenciadores.`,
      };
    }
    if (diff < -25) {
      return {
        nivel: "oportunidad",
        mensaje: `🔥 ${Math.round(Math.abs(diff))}% bajo el mercado. ¡Muy atractivo!`,
      };
    }
    if (diff < -15) {
      return {
        nivel: "bueno",
        mensaje: `✅ ${Math.round(Math.abs(diff))}% bajo el mercado. Competitivo.`,
      };
    }
    return { nivel: "optimo", mensaje: "✅ Dentro del rango de mercado." };
  })();

  return {
    formDataPropiedad,
    setCampo,
    conditionTypes,
    features,
    cargandoCatalogos,
    handleYearChange,
    handleAntiguedadChange,
    featuresSel,
    toggleFeature,
    loading,
    onSubmit,
    precioSugerido,
    validacionPrecio,
    descripcionesIA,
    generandoIA,
    generarDescripcionesIA,
    usarDescripcionIA,
    tituloGenerado,
  };
};

export default useDetalles;
