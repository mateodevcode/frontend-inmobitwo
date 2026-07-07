import { TbPointFilled } from "react-icons/tb";
import { useAppContext } from "@/context/AppContext";
import { getInitials } from "@/lib/getInitials";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import useOrganizaciones from "@/hooks/useOrganizaciones";

const Actividad = () => {
  const { organizaciones, propiedades, usuario, setOpenModalActividades } =
    useAppContext();
  const [isSeguir, setIsSeguir] = useState(false);
  const { cargarOrganizaciones } = useOrganizaciones();

  const listaOrganizaciones = organizaciones;

  const cantidad_propiedades = propiedades.filter(
    (pro) => pro.publicador.id === usuario.id,
  );

  useEffect(() => {
    cargarOrganizaciones();
  }, []);

  return (
    <div className="bg-white w-full md:w-96 h-svh font-poppins border-l border-black/20 fixed right-0 overflow-y-auto">
      {/* tu actividad */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-black uppercase">Tu actividad</h2>
          <button
            className="bg-black/10 w-10 h-10 md:hidden items-center justify-center rounded-full flex"
            onClick={() => setOpenModalActividades(false)}
          >
            <IoClose className="text-black text-xl" />
          </button>
        </div>
        <div className="grid grid-cols-2 p-2 gap-5 mt-4">
          <div className="flex flex-col bg-linear-to-bl from-green-200 via-green-700 to-green-500 p-4 rounded-md border-green-300 shadow-md shadow-green-300 h-24">
            <p className="text-3xl text-green-200 font-semibold">
              {cantidad_propiedades.length}
            </p>
            <span className="text-xs text-green-100">Propiedades activas</span>
          </div>
          <div className="flex flex-col bg-linear-to-bl from-blue-200 via-blue-700 to-blue-900 p-4 rounded-md border-blue-300 shadow-md shadow-blue-300 h-24">
            <p className="text-3xl text-blue-200 font-semibold">48</p>
            <span className="text-xs text-blue-100">Contactos este mes</span>
          </div>
          <div className="flex flex-col bg-linear-to-bl from-rose-200 via-rose-700 to-rose-900 p-4 rounded-md border-rose-300 shadow-md shadow-rose-300 h-24">
            <p className="text-3xl text-rose-200 font-semibold">284</p>
            <span className="text-xs text-rose-100">Visitas totales</span>
          </div>
          <div className="flex flex-col bg-linear-to-bl from-purple-200 via-purple-700 to-purple-900 p-4 rounded-md border-purple-300 shadow-md shadow-purple-300 h-24">
            <p className="text-3xl text-purple-200 font-semibold">3</p>
            <span className="text-xs text-purple-100">En negociacion</span>
          </div>
        </div>
      </div>

      {/* actividad reciente */}
      <div className="p-4">
        <h2 className="text-sm text-black uppercase">Actividad reciente</h2>
        <div className="grid grid-cols-1 p-4 gap-5">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <TbPointFilled className="text-purple-600" />
              <span className="text-xs text-black">
                Laura M. guardó tu propiedad en Salamanca
              </span>
            </div>
            <span className="text-xs">Hace 10 min</span>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-2">
              <TbPointFilled className="text-red-600" />
              <span className="text-xs text-black">
                Nueva solicitud de visita para el ático en Goya
              </span>
            </div>
            <span className="text-xs">Hace 45 min</span>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-2">
              <TbPointFilled className="text-green-600" />
              <span className="text-xs text-black">
                Inmobiliaria Norte ha publicado 3 propiedades nuevas
              </span>
            </div>
            <span className="text-xs">Hace 1 hora</span>
          </div>
        </div>
      </div>

      {/* Organizaciones recienes */}
      <div className="p-4">
        <h2 className="text-black uppercase text-sm">
          Organizaciones segeridas
        </h2>
        <div className="grid grid-cols-1 p-4 gap-5">
          {listaOrganizaciones.map((org, i) => {
            const color = getColorForOrg(org.id || i);
            return (
              <div className="flex justify-between items-center" key={i}>
                <div className="flex gap-2 ">
                  <div
                    className={`w-10 h-10 ${color.bg} ${color.text} rounded-md flex items-center justify-center font-semibold`}
                  >
                    {getInitials(org.nombre)}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-black text-sm">
                      {formatFirstTwoNames(org.nombre)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-black/80">
                      <p>24 Propiedades</p> <p>BCN</p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="text-xs text-black font-semibold cursor-pointer select-none hover:text-[#FF1B1C]"
                    type="button"
                    onClick={() => setIsSeguir(!isSeguir)}
                  >
                    {isSeguir ? "Siguiendo" : "Seguir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mapa de actividades */}
      <div className="p-4">
        <h2 className="text-black uppercase text-sm">Mapa de actividad</h2>
        <div className="flex items-center justify-center h-40 bg-olive-200 mt-4 rounded-md border border-olive-300 shadow-md">
          <p className="text-sm text-black">Ver propiedades en mapa</p>
        </div>
      </div>
    </div>
  );
};

export default Actividad;
