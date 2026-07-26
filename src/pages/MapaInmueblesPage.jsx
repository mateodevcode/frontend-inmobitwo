// src/pages/MapaInmueblesPage.jsx
import { useParams } from "react-router-dom";
import MapaInmuebles from "@/features/mapa-inmuebles/MapaInmuebles";
// import NavbarListaPropiedades from "./lista-propiedades/NavbarListaPropiedades";

export default function MapaInmueblesPage() {
  const { operationAndType } = useParams();

  const parts = (operationAndType || "venta-viviendas").split("-");
  const operation = parts[0];
  const tipoInmueble = parts.slice(1).join("-");

  return (
    <div className="flex flex-col w-screen h-screen font-poppins">
      {/* <NavbarListaPropiedades /> */}
      <div className="flex-1 relative">
        <MapaInmuebles
          lat={4.6}
          lng={-74.1}
          zoom={6}
          operation={operation}
          tipoInmueble={tipoInmueble}
        />
      </div>
    </div>
  );
}
