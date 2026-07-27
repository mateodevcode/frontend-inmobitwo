import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export function useModalUser({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { handleCerrarSesion } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const irAPerfil = () => {
    onClose();
    navigate("/usuario/tus-datos/perfil");
  };

  const irANotificaciones = () => {
    onClose();
    navigate("/usuario/tus-datos/notificaciones");
  };

  const cerrarSesion = () => {
    onClose();
    handleCerrarSesion();
  };

  return { irAPerfil, irANotificaciones, cerrarSesion };
}
