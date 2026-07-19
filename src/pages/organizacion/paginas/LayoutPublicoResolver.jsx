// src/pages/organizacion/paginas/LayoutPublicoResolver.jsx
// Modo red-social bajo /inmobiliarias/:slug — hay que buscar la org por slug
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";
import { getTema } from "@/pages/organizacion/temas/temaRegistry.js";
import Loading from "../temas/loading/Loading";

const LayoutPublicoResolver = () => {
  const { slug } = useParams();
  const { cargarOrganizacionPorSlug } = useOrganizaciones();
  const [organizacion, setOrganizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setNotFound(false);
      const res = await cargarOrganizacionPorSlug(slug);
      if (res.success) setOrganizacion(res.data);
      else setNotFound(true);
      setLoading(false);
    };
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <Loading logo="/logo/logo-hor.png" type="opcion2" />;

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h1 className="text-xl font-bold mb-2">Organización no encontrada</h1>
      </div>
    );
  }

  const { Layout } = getTema(organizacion.tema);
  return (
    <Layout organizacion={organizacion} basePath={`/inmobiliarias/${slug}`} />
  );
};

export default LayoutPublicoResolver;
