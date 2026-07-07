import Acceso from "@/components/usuario/tus-datos/Acceso";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import { SiteFooter } from "@/components/publicar-anuncio/info-publicar/SiteFooter";
import ModalCambiarPassword from "@/components/modales/ModalCambiarPassword";

const SeguridadAcceso = () => {
  return (
    <div>
      <Acceso />

      <div className="h-1 w-full bg-rose-600/50 rounded-md mt-8" />

      <div className="w-full flex items-center justify-center font-poppins">
        <div className="w-10/12 flex flex-col my-10 gap-2">
          <h3 className="text-2xl font-semibold text-black">
            ¿Problemas? Llámanos al 917882791
          </h3>
          <p className="text-lg">
            Atención personalizada para clientes de lunes a viernes de 9:00 a
            21:00, fines de semana y festivos de 10:00 a 18:00.
          </p>
          <p className="text-lg">
            Si tu llamada es sobre un anuncio, llámanos desde el teléfono que
            hayas indicado para que te ayudemos más rápido
          </p>
        </div>
      </div>
      <SiteFooter />

      <ModalCambiarPassword />
      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default SeguridadAcceso;
