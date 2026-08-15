import { useEffect, useState } from "react";
import DatosBasicos from "@/pages/publicar-anuncio/paso-1/DatosBasicos";
import Detalles from "@/pages/publicar-anuncio/paso-2/Detalles";
import Fotos from "@/pages/publicar-anuncio/paso-3/Fotos";
import HeaderPublicarAnuncio from "@/pages/publicar-anuncio/header/HeaderPublicarAnuncio";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { apiBackend } from "@/api/apiBackend";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModalContinuarAnuncio } from "@/components/modales/ModalContinuarAnuncio";
import useResetForm, {
  mapearApiAFormDataPropiedad,
} from "@/hooks/useResetForm";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";
import BarraNavegacionTauri from "../../components/barra-navegacion/BarraNavegacionTauri";
import {
  guardarProgreso,
  guardarSnapshot,
  leerProgreso,
  leerSnapshot,
  limpiarTodo,
  PASO_DATOS_BASICOS,
  PASO_DETALLES,
  PASO_FOTOS,
} from "@/pages/publicar-anuncio/anuncioProgreso";
import { AiOutlineFileSearch } from "react-icons/ai";
import ModalInformativo from "../../components/modales/ModalInformativo";

const PublicarAnuncio = () => {
  const {
    contentNumber,
    setContentNumber,
    setFormDataPropiedad,
    formDataPropiedad,
    iniciarCarga,
    terminarCarga,
    openModalInformativo,
    setOpenModalInformativo,
  } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { resetFormDataPropiedad } = useResetForm();

  // Progreso guardado (aplica solo cuando NO hay ?id en la URL). Se lee una vez
  // al montar; los cambios de ?id se manejan en el efecto de abajo.
  const [progresoInicial] = useState(() => (id ? null : leerProgreso()));

  const [modalContinuar, setModalContinuar] = useState(
    () => !!progresoInicial?.id,
  );
  const [anuncioGuardado] = useState(() =>
    progresoInicial?.id ? progresoInicial : null,
  );

  const cargarPropiedad = async (anuncioId) => {
    try {
      iniciarCarga();
      const res = await apiBackend(`/propiedades/${anuncioId}`);
      const { success, data } = res;

      if (success && data) {
        // 🔑 Si ya tiene imagen principal, el proceso ya terminó.
        // No tiene sentido volver al wizard — mandar a la lista.
        if (data.imagen_principal_url) {
          limpiarTodo();
          navigate("/usuario/mis-anuncios", { replace: true });
          return;
        }

        // Respeta el paso guardado (ej: si el usuario iba de vuelta a "Detalles").
        const progreso = leerProgreso();
        const paso = progreso?.step ?? PASO_FOTOS;
        guardarProgreso({ id: anuncioId, step: paso });
        setFormDataPropiedad(mapearApiAFormDataPropiedad(data));
        setContentNumber(paso - 1);
      } else {
        limpiarTodo();
        navigate("/info/publicar-anuncio/publicar", { replace: true });
        setContentNumber(0);
      }
    } catch (error) {
      console.error("Error cargando propiedad:", error);
      setContentNumber(0);
    } finally {
      terminarCarga();
    }
  };

  useEffect(() => {
    if (id) {
      // Hay id en la URL => flujo normal, traer datos y ubicarse según el paso
      cargarPropiedad(id);
      return;
    }

    // Sin id: si aún no hay propiedad creada, retomar el paso guardado
    // restaurando el snapshot. El caso "modal" ya quedó inicializado arriba.
    if (
      progresoInicial &&
      !progresoInicial.id &&
      (progresoInicial.step === PASO_DATOS_BASICOS ||
        progresoInicial.step === PASO_DETALLES)
    ) {
      const snapshot = leerSnapshot();
      const paso = progresoInicial.step;
      queueMicrotask(() => {
        if (snapshot) setFormDataPropiedad(snapshot);
        setContentNumber(paso - 1);
      });
      return;
    }

    // Sin progreso pero con snapshot: estaba a mitad del paso 1 → restaurar.
    if (!progresoInicial) {
      const snapshot = leerSnapshot();
      if (snapshot) {
        queueMicrotask(() => setFormDataPropiedad(snapshot));
      }
      // contentNumber se queda en 0 (paso 1)
    }
  }, [id, progresoInicial]);

  // Autosave: mientras esté en pasos 1-2 (sin propiedad creada), guarda un
  // snapshot del formulario para sobrevivir un refresh/cierre del navegador.
  useEffect(() => {
    if (modalContinuar) return;
    if (contentNumber >= PASO_FOTOS - 1) return;
    const t = setTimeout(() => {
      guardarSnapshot(formDataPropiedad);
    }, 500);
    return () => clearTimeout(t);
  }, [contentNumber, formDataPropiedad, modalContinuar]);

  const handleContinuarAnuncio = () => {
    setModalContinuar(false);
    navigate(`/info/publicar-anuncio/publicar?id=${anuncioGuardado.id}`, {
      replace: true,
    });
    // el useEffect se vuelve a disparar porque cambia el id en la URL,
    // y cargarPropiedad se encarga del resto
  };

  const handleNuevoAnuncio = () => {
    limpiarTodo();
    setModalContinuar(false);
    resetFormDataPropiedad(); // resetea el form si aplica
    setContentNumber(0);
    navigate("/info/publicar-anuncio/publicar");
  };

  return (
    <div className="bg-primero min-h-dvh">
      <HeaderPublicarAnuncio />

      {modalContinuar && (
        <ModalContinuarAnuncio
          anuncio={anuncioGuardado}
          onContinuar={handleContinuarAnuncio}
          onNuevo={handleNuevoAnuncio}
          propiedad={formDataPropiedad}
        />
      )}

      {!modalContinuar && contentNumber === 0 && <DatosBasicos />}
      {!modalContinuar && contentNumber === 1 && <Detalles />}
      {!modalContinuar && contentNumber === 2 && <Fotos />}

      <ModalHamburguesa />
      <div
        className="w-10 h-10 bg-segundo/5 rounded-xl fixed right-2 bottom-2 flex items-center justify-center border border-segundo/5 hover:bg-segundo/10 cursor-pointer select-none active:scale-95 duration-75 transition z-50 lg:hidden"
        onClick={() => setOpenModalInformativo(!openModalInformativo)}
      >
        <AiOutlineFileSearch className="text-xl text-segundo" />
      </div>

      <BarraNavegacionTauri />
      <ModalInformativo />

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default PublicarAnuncio;
