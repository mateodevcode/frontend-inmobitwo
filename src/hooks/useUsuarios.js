// src/hooks/useUsuarios.js
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext.js";
import { apiBackend } from "@/api/apiBackend.js";
import { useNavigate } from "react-router-dom";
import useResetForm from "@/hooks/useResetForm";
import { apiBackendFormData } from "@/api/apiBackendFormData.js";
import { validatePasswordNueva } from "../utils/validatePassword";

const useUsuarios = () => {
  const {
    // refreshPropiedades,
    iniciarCarga,
    terminarCarga,
    setFormDataUsuario,
    formDataUsuario,
  } = useAppContext();
  const navigate = useNavigate();
  const { resetFormDataUsuario } = useResetForm();

  // ========================================
  // HANDLE CHANGE IMAGEN PRINCIPAL
  // ========================================
  const handleChangeFile = (e, setFile, setPreview) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("El archivo pesa más de 10MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ========================================
  // HANDLE CHANGE CAMPOS TEXTO
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataUsuario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actualizarUsuario = async (
    e,
    id,
    setLoading,
    formData,
    imagenPrincipal,
    eliminarImagenPrincipal = false, // 👈 nuevo parámetro
  ) => {
    e.preventDefault();

    try {
      iniciarCarga();
      setLoading(true);

      let data;

      if (imagenPrincipal) {
        // HAY IMAGEN NUEVA → multipart
        const fd = new FormData();
        fd.append("imagenPrincipal", imagenPrincipal);

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            fd.append(key, value);
          }
        });

        data = await apiBackendFormData(`/usuarios/${id}`, fd, "PATCH");
      } else if (eliminarImagenPrincipal) {
        // QUIERE ELIMINAR LA FOTO (sin subir una nueva) → JSON normal
        const payload = Object.fromEntries(
          Object.entries(formData).filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== "",
          ),
        );
        payload.eliminarImagenPrincipal = true;

        data = await apiBackend(`/usuarios/${id}`, "PATCH", payload);
      } else {
        // SIN CAMBIOS DE IMAGEN → JSON normal
        const payload = Object.fromEntries(
          Object.entries(formData).filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== "",
          ),
        );

        if (Object.keys(payload).length === 0) {
          toast.warn("No hay cambios para guardar", {
            position: "bottom-right",
          });
          return;
        }

        data = await apiBackend(`/usuarios/${id}`, "PATCH", payload);
      }

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Usuario actualizado correctamente", {
          position: "bottom-right",
        });
      } else {
        console.warn("⚠️ Error:", error);
        toast.error(error || message, { position: "bottom-right" });
      }

      return data;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error actualizando el usuario", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  const cambiarPassword = async (
    e,
    id,
    setLoading,
    passwordActual,
    passwordNueva,
  ) => {
    e.preventDefault();

    const errores = validatePasswordNueva(passwordActual, passwordNueva);
    if (errores.length > 0) {
      toast.error(errores[0], { position: "bottom-right" });
      return { success: false };
    }

    try {
      iniciarCarga();
      setLoading(true);

      const data = await apiBackend(`/usuarios/${id}/password`, "PATCH", {
        passwordActual,
        passwordNueva,
      });

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Contraseña actualizada correctamente", {
          position: "bottom-right",
        });
      } else {
        toast.error(error || message, { position: "bottom-right" });
      }

      return data;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error cambiando la contraseña", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ========================================
  // ENVIAR CÓDIGO DE VERIFICACIÓN
  // ========================================
  const enviarCodigoVerificacion = async (id, setLoading) => {
    try {
      iniciarCarga();
      setLoading(true);

      const data = await apiBackend(`/usuarios/${id}/enviar-codigo`, "POST");

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Código de verificación enviado", {
          position: "bottom-right",
        });
      } else {
        toast.error(error || message, { position: "bottom-right" });
      }

      return data;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error enviando el código de verificación", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ========================================
  // CONFIRMAR CÓDIGO DE VERIFICACIÓN
  // ========================================
  const confirmarCodigoVerificacion = async (id, setLoading, codigo) => {
    try {
      iniciarCarga();
      setLoading(true);

      const data = await apiBackend(
        `/usuarios/${id}/confirmar-codigo`,
        "POST",
        { codigo },
      );

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Correo verificado correctamente", {
          position: "bottom-right",
        });
      } else {
        toast.error(error || message, { position: "bottom-right" });
      }

      return data;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error verificando el código", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  // ========================================
  // DESACTIVAR VERIFICACIÓN EN DOS PASOS
  // ========================================
  const desactivarVerificacionEmail = async (id, setLoading) => {
    try {
      iniciarCarga();
      setLoading(true);

      const data = await apiBackend(
        `/usuarios/${id}/desactivar-verificacion`,
        "PATCH",
      );

      const { success, message, error } = data;

      if (success) {
        toast.success(message || "Verificación desactivada", {
          position: "bottom-right",
        });
      } else {
        toast.error(error || message, { position: "bottom-right" });
      }

      return data;
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error desactivando la verificación", {
        position: "bottom-right",
      });
      return { success: false };
    } finally {
      terminarCarga();
      setLoading(false);
    }
  };

  return {
    handleChangeFile,
    handleChange,
    actualizarUsuario,
    cambiarPassword,
    desactivarVerificacionEmail,
    confirmarCodigoVerificacion,
    enviarCodigoVerificacion,
  };
};

export default useUsuarios;
