import useDetallePropiedad from "@/hooks/useDetallePropiedad";
import SidebarContacto from "./SidebarContacto";
import HeaderDinamico from "./HeaderDinamico";
import BarraNavegacion from "./BarraNavegacion";
import CardPrincipal from "./CardPrincipal";
import DetalleInmuble from "./DetalleInmuble";
import GaleriaInmuebles from "./GaleriaInmuebles";

export default function DetallePropiedad({
  inmueble,
  onClose,
  listaIds,
  posicion,
  total,
  filtroLabel,
  onNavigateTo,
}) {
  const {
    mostrarBarraSticky,
    setMostrarBarraSticky,
    fotos,
    totalImagenes,
    totalPlanos,
    specsLinea,
  } = useDetallePropiedad(inmueble);

  // ──────────────────────── Early return ────────────────────────
  if (!inmueble) return null;

  return (
    <div className="bg-gray-100 relative">
      {/* ──── Barra sticky (aparece al scrollear pasado el bloque de precio) ──── */}
      <div
        className={`fixed top-0 left-0 right-0 z-1200 bg-white shadow-md transition-all duration-300 ease-out ${
          mostrarBarraSticky
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <HeaderDinamico
          inmueble={inmueble}
          onClose={onClose}
          specsLinea={specsLinea}
        />
      </div>

      {/* ──── Botón cerrar (barra superior existente) ──── */}
      <BarraNavegacion
        onClose={onClose}
        filtroLabel={filtroLabel}
        listaIds={listaIds}
        onNavigateTo={onNavigateTo}
        posicion={posicion}
        total={total}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 max-w-4xl mx-auto">
        <div className="min-w-0 bg-white px-5 font-poppins">
          <GaleriaInmuebles
            totalImagenes={totalImagenes}
            fotos={fotos}
            inmueble={inmueble}
          />

          <CardPrincipal
            inmueble={inmueble}
            specsLinea={specsLinea}
            totalImagenes={totalImagenes}
            totalPlanos={totalPlanos}
          />

          <DetalleInmuble
            fotos={fotos}
            inmueble={inmueble}
            setMostrarBarraSticky={setMostrarBarraSticky}
            totalImagenes={totalImagenes}
          />
        </div>

        {/* ──── Sidebar de contacto (sticky) ──── */}
        <div className="lg:sticky lg:top-4 h-fit bg-white mt-4 font-poppins">
          <SidebarContacto inmueble={inmueble} />
        </div>
      </div>
    </div>
  );
}
