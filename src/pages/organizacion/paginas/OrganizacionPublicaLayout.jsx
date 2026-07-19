// src/pages/organizacion/paginas/OrganizacionPublicaLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";
import OrganizacionNav from "./OrganizacionNav.jsx";
import Loading from "../temas/loading/Loading.jsx";

const OrganizacionPublicaLayout = () => {
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
      if (res.success) {
        setOrganizacion(res.data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return <Loading logo="/logo/logo-hor.png" type="opcion2" />;
  }

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h1 className="text-xl font-bold mb-2">Organización no encontrada</h1>
        <p className="text-gray-500">
          Puede que aún no esté aprobada o que la URL sea incorrecta.
        </p>
      </div>
    );
  }

  return (
    <div>
      <OrganizacionNav
        basePath={`/inmobiliarias/${slug}`}
        organizacion={organizacion}
      />
      <Outlet context={organizacion} />
    </div>
  );
};

export default OrganizacionPublicaLayout;
