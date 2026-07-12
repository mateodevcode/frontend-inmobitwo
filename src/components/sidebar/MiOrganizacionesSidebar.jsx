// src/components/.../MiOrganizacionesSidebar.jsx
import { useEffect, useState } from "react";
import { items_organizacion } from "@/data/items_sidebar";
import { useAppContext } from "@/context/AppContext.js";
import { useNavigate } from "react-router-dom";
import { HiBuildingOffice2 } from "react-icons/hi2";
import useOrganizaciones from "@/hooks/useOrganizaciones.js";
import { toCapitalize } from "../../lib/toCapitalize";
import BotonAdminOrganizaciones from "./BotonAdminOrganizaciones";

const MiOrganizacionesSidebar = ({ itemSelect, setItemSelect }) => {
  const { organizaciones, setOrganizaciones, usuario } = useAppContext();
  const navigate = useNavigate();
  const { cargarMisOrganizaciones } = useOrganizaciones();
  const [cargando, setCargando] = useState(true);
  const dominio_dns = organizaciones[0]?.custom_domain
    ? `https://${organizaciones[0]?.custom_domain}`
    : `/inmobiliarias/${organizaciones[0]?.slug}`;

  useEffect(() => {
    const cargar = async () => {
      if (!usuario) {
        setCargando(false);
        return;
      }
      setCargando(true);
      const res = await cargarMisOrganizaciones();
      if (res.success) {
        setOrganizaciones(res.data);
      }
      setCargando(false);
    };

    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  if (cargando) {
    return <div className="px-2.5 py-4 text-xs text-black/40">Cargando...</div>;
  }

  // Caso: No tiene ninguna organización
  if (organizaciones.length === 0) {
    return (
      <div>
        <BotonAdminOrganizaciones />

        <h3 className="uppercase font-semibold text-xs text-black/60 px-2">
          Mi organización
        </h3>
        <div className="px-2.5 pb-2.5 mt-3">
          <div className="w-full p-4 flex flex-col items-center">
            <div className="mb-2">
              <HiBuildingOffice2 className="text-3xl" />
            </div>
            <p className="font-medium text-sm">Crear mi organización</p>
            <p className="text-xs text-black/50 mt-1">
              Publica propiedades bajo tu propio sello inmobiliario
            </p>
            <button
              className="rounded-md bg-rose-600 px-6 py-2 text-lg md:text-lg font-semibold text-white hover:bg-rose-500 active:scale-[0.99] cursor-pointer select-none mt-4"
              onClick={() => {
                navigate("/inmobiliarias/nueva");
              }}
            >
              registrar inmobiliaria
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Caso: Tiene al menos una organización
  const organizacionActiva = organizaciones[0];

  return (
    <div>
      <BotonAdminOrganizaciones />
      <h3 className="uppercase font-semibold text-xs text-black/60 px-2">
        Mi organización
      </h3>

      {/* Datos reales de la organización, no un placeholder */}
      <div className="px-2.5 pt-2 pb-1">
        <a
          className="flex items-center gap-3 p-3 rounded-lg  hover:bg-blue-50 border hover:border-blue-100 border-transparent cursor-pointer select-none"
          href={dominio_dns}
          target="_blank"
        >
          {organizacionActiva.logo_url ? (
            <img
              src={organizacionActiva.logo_url}
              alt={organizacionActiva.nombre}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <HiBuildingOffice2 className="text-xl text-blue-600" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-black">
              {toCapitalize(organizacionActiva.nombre)}
            </p>
            <p className="text-[11px] text-black/50 capitalize">
              {organizacionActiva.rol_en_org === "agency_admin"
                ? "Administrador"
                : "Agente"}{" "}
              · {organizacionActiva.estado}
            </p>
          </div>
        </a>
      </div>

      <div className="px-2.5 pb-2.5">
        {items_organizacion.map((item, i) => (
          <div
            className={`my-1 p-3 rounded-lg text-sm flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-all duration-75 border text-black ${
              itemSelect === item.label
                ? "bg-stone-100 border-black/10"
                : "border-transparent hover:bg-stone-100 hover:border-black/10"
            }`}
            key={i}
            onClick={() => {
              setItemSelect(item.label);
              // "estadisticas" trae un "id" placeholder literal en items_sidebar.js;
              // hay que resolverlo con el id real de la organización activa antes de navegar.
              const url =
                item.label === "estadisticas"
                  ? item.url.replace("id", organizacionActiva.id)
                  : item.url;
              navigate(url);
            }}
          >
            <div className="text-xl">{item.icon}</div>
            {item.name}
          </div>
        ))}
      </div>

      {organizaciones.length > 1 && (
        <div className="px-3 text-xs text-black/50 mt-1">
          {`${organizaciones.length} organizaciones`}
        </div>
      )}
    </div>
  );
};

export default MiOrganizacionesSidebar;
