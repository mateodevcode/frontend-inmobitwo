// hooks/useFotos.js

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import usePropiedades from "@/hooks/usePropiedades";
import {
  actualizarPaso,
  leerProgreso,
  PASO_DETALLES,
} from "@/pages/publicar-anuncio/anuncioProgreso";

const MAX_SIZE = 10 * 1024 * 1024;

const useFotos = () => {
  const { setContentNumber } = useAppContext();
  const { subirFotosAnuncio, continuarSinFotos } = usePropiedades();
  const [searchParams] = useSearchParams();
  const anuncioId = searchParams.get("id") ?? leerProgreso()?.id ?? null;

  // Imagen principal
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [previewPrincipal, setPreviewPrincipal] = useState(null);

  // Galería
  const [galeriaFiles, setGaleriaFiles] = useState([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState([]);

  // Planos
  const [planosFiles, setPlanosFiles] = useState([]);
  const [planosPreviews, setPlanosPreviews] = useState([]);

  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const hayFotos =
    !!imagenPrincipal || galeriaFiles.length > 0 || planosFiles.length > 0;

  const handlePrincipalSelected = (file) => {
    if (!file || file.size > MAX_SIZE) return;
    setImagenPrincipal(file);
    setPreviewPrincipal(URL.createObjectURL(file));
  };

  // La primera foto que se sube en TODO el flujo (si no hay principal aún)
  // se vuelve automáticamente la principal.
  const handleGaleriaFilesSelected = (files) => {
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE) continue;
      validFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), name: file.name });
    }

    if (validFiles.length === 0) return;

    if (!imagenPrincipal) {
      const [primera, ...resto] = validFiles;
      const [previewPrimera, ...previewResto] = newPreviews;

      setImagenPrincipal(primera);
      setPreviewPrincipal(previewPrimera.url);

      setGaleriaFiles((prev) => [...prev, ...resto]);
      setGaleriaPreviews((prev) => [...prev, ...previewResto]);
      return;
    }

    setGaleriaFiles((prev) => {
      const total = prev.length + validFiles.length;
      if (total > 10) return prev;
      return [...prev, ...validFiles];
    });
    setGaleriaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteGaleriaPreview = (index) => {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePlanosFilesSelected = (files) => {
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE) continue;
      validFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), name: file.name });
    }

    if (validFiles.length === 0) return;

    setPlanosFiles((prev) => {
      const total = prev.length + validFiles.length;
      if (total > 10) return prev;
      return [...prev, ...validFiles];
    });
    setPlanosPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeletePlanoPreview = (index) => {
    setPlanosFiles((prev) => prev.filter((_, i) => i !== index));
    setPlanosPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Convierte una foto de la galería en la principal (swap)
  const handleMakePrincipal = (index) => {
    const nuevaPrincipalFile = galeriaFiles[index];
    const nuevaPrincipalPreview = galeriaPreviews[index];

    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));

    if (imagenPrincipal) {
      setGaleriaFiles((prev) => [...prev, imagenPrincipal]);
      setGaleriaPreviews((prev) => [
        ...prev,
        { url: previewPrincipal, name: "principal-anterior" },
      ]);
    }

    setImagenPrincipal(nuevaPrincipalFile);
    setPreviewPrincipal(nuevaPrincipalPreview.url);
  };

  const handleContinueClick = () => {
    if (!hayFotos) {
      setShowWarning(true);
      return;
    }
    subirFotosAnuncio(
      anuncioId,
      setLoading,
      imagenPrincipal,
      galeriaFiles,
      planosFiles,
    );
  };

  const handleBack = () => {
    // Al volver al paso 2 el anuncio ya existe: la lógica cambia a "actualizar".
    actualizarPaso(PASO_DETALLES);
    setContentNumber(1);
  };

  const handleAddPhotosNow = () => setShowWarning(false);

  const handleContinueAnyway = () => {
    setShowWarning(false);
    continuarSinFotos();
  };

  return {
    anuncioId,
    imagenPrincipal,
    previewPrincipal,
    galeriaFiles,
    galeriaPreviews,
    planosFiles,
    planosPreviews,
    showWarning,
    loading,
    hayFotos,
    handlePrincipalSelected,
    handleGaleriaFilesSelected,
    handleDeleteGaleriaPreview,
    handlePlanosFilesSelected,
    handleDeletePlanoPreview,
    handleMakePrincipal,
    handleContinueClick,
    handleBack,
    handleAddPhotosNow,
    handleContinueAnyway,
  };
};

export default useFotos;
