import { useEffect, useState } from "react";
import DatosBasicos from "@/components/publicar-anuncio/DatosBasicos";
import Detalles from "@/components/publicar-anuncio/Detalles";
import Fotos from "@/components/publicar-anuncio/Fotos";
import HeaderPublicarAnuncio from "@/components/publicar-anuncio/HeaderPublicarAnuncio";
import { useAppContext } from "@/context/AppContext";
import { scrollbarStyles } from "@/data/data.styles.scrollbar";
import { apiBackend } from "@/api/apiBackend";
import { useNavigate } from "react-router-dom";
import { ModalContinuarAnuncio } from "@/components/publicar-anuncio/ModalContinuarAnuncio";
import useResetForm, {
  mapearApiAFormDataPropiedad,
} from "@/hooks/useResetForm";
import ModalHamburguesa from "@/components/modales/modal-hamburguesa/ModalHamburguesa";

const PublicarAnuncio = () => {
  const {
    contentNumber,
    setContentNumber,
    setFormDataPropiedad,
    formDataPropiedad,
    iniciarCarga,
    terminarCarga,
  } = useAppContext();
  const navigate = useNavigate();
  const { resetFormDataPropiedad } = useResetForm();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [modalContinuar, setModalContinuar] = useState(false);
  const [anuncioGuardado, setAnuncioGuardado] = useState(null);

  const cargarPropiedad = async (anuncioId) => {
    try {
      iniciarCarga();
      const res = await apiBackend(`/propiedades/${anuncioId}`);
      const { success, data } = res;

      if (success && data) {
        // 🔑 Si ya tiene imagen principal, el proceso ya terminó.
        // No tiene sentido volver al wizard — mandar a la lista.
        if (data.imagen_principal_url) {
          localStorage.removeItem("ultimoAnuncioId");
          navigate("/usuario/mis-anuncios", { replace: true });
          return;
        }

        localStorage.setItem(
          "ultimoAnuncioId",
          JSON.stringify({
            id: anuncioId,
            timestamp: new Date().toISOString(),
          }),
        );
        setFormDataPropiedad(mapearApiAFormDataPropiedad(data));
        setContentNumber(2);
      } else {
        localStorage.removeItem("ultimoAnuncioId");
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
      // Hay id en la URL => flujo normal, traer datos y saltar a paso 2
      cargarPropiedad(id);
      return;
    }

    // No hay id en la URL => revisar si hay uno guardado en localStorage
    const guardado = localStorage.getItem("ultimoAnuncioId");
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        setAnuncioGuardado(parsed);
        setModalContinuar(true); // mostrar modal de "¿quieres continuar?"
      } catch {
        localStorage.removeItem("ultimoAnuncioId");
        setContentNumber(0);
      }
    } else {
      setContentNumber(0);
    }
  }, [id]);

  const handleContinuarAnuncio = () => {
    setModalContinuar(false);
    navigate(`/info/publicar-anuncio/publicar?id=${anuncioGuardado.id}`, {
      replace: true,
    });
    // el useEffect se vuelve a disparar porque cambia el id en la URL,
    // y cargarPropiedad se encarga del resto
  };

  const handleNuevoAnuncio = () => {
    localStorage.removeItem("ultimoAnuncioId");
    setModalContinuar(false);
    resetFormDataPropiedad(); // resetea el form si aplica
    setContentNumber(0);
    navigate("/info/publicar-anuncio/publicar");
  };

  return (
    <div className="">
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

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default PublicarAnuncio;
