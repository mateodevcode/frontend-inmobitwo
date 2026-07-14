// src/hooks/usePropiedadesOrganizacionData.js
import { useCallback, useEffect, useState } from "react";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";

// ────────────────────────────────────────────────────────────────
// Extrae la lógica de carga+paginación que antes vivía adentro de
// PaginaOrganizacion.jsx, para que TODOS los temas la reusen sin
// duplicar el fetch. Cada tema decide cómo se ve, este hook decide
// cómo se consiguen los datos.
// ────────────────────────────────────────────────────────────────
const usePropiedadesOrganizacionData = (slug) => {
  const { cargarPropiedadesOrganizacion } = useOrganizaciones();

  const [organizacion, setOrganizacion] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const cargar = useCallback(
    async (cursorActual = null) => {
      if (!slug) return;
      setLoading(true);
      const res = await cargarPropiedadesOrganizacion(slug, cursorActual);

      if (res.success) {
        setOrganizacion(res.data.organizacion);
        setPropiedades((prev) =>
          cursorActual ? [...prev, ...res.data.data] : res.data.data,
        );
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    },
    [slug, cargarPropiedadesOrganizacion],
  );

  useEffect(() => {
    setPropiedades([]);
    setCursor(null);
    setHasMore(true);
    setNotFound(false);
    if (slug) cargar(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const cargarMas = () => {
    if (!loading && hasMore) cargar(cursor);
  };

  return { organizacion, propiedades, loading, notFound, hasMore, cargarMas };
};

export default usePropiedadesOrganizacionData;
