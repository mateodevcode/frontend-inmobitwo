import PrincipalDropzone from "./components/PrincipalDropzone";
import GaleriaDropzone from "./components/GaleriaDropzone";
import GaleriaPreviewGrid from "./components/GaleriaPreviewGrid";
import InfoBannerBlue from "./components/InfoBannerBlue";
import TipsList from "./components/TipsList";
import WizardFooter from "./components/WizardFooter";
import NoPhotosWarningModal from "./components/NoPhotosWarningModal";
import { TIPS } from "@/data/fotos.jsx";
import useFotos from "@/hooks/useFotos";

const Fotos = () => {
  const {
    previewPrincipal,
    handlePrincipalSelected,
    galeriaFiles,
    galeriaPreviews,
    handleGaleriaFilesSelected,
    handleDeleteGaleriaPreview,
    handleMakePrincipal,
    planosFiles,
    planosPreviews,
    handlePlanosFilesSelected,
    handleDeletePlanoPreview,
    showWarning,
    loading,
    hayFotos,
    handleContinueClick,
    handleBack,
    handleAddPhotosNow,
    handleContinueAnyway,
  } = useFotos();

  return (
    <div className="flex max-w-2xl flex-col gap-6 font-montserrat relative pb-40">
      <div className="rounded-lg md:p-8 p-6">
        <h2 className="mb-2 text-2xl font-semibold text-segundo">
          Añadir fotos a tu anuncio
        </h2>
        <p className="mb-6 text-base text-segundo/60">
          La primera foto que subas será tu foto principal — puedes cambiarla
          más tarde marcando otra con la estrella.
        </p>

        <PrincipalDropzone
          preview={previewPrincipal}
          onFileSelected={handlePrincipalSelected}
        />

        <div className="mt-8">
          <GaleriaDropzone
            onFilesSelected={handleGaleriaFilesSelected}
            count={galeriaFiles.length}
            titulo="Galería de fotos"
          />
          <GaleriaPreviewGrid
            previews={galeriaPreviews}
            onDelete={handleDeleteGaleriaPreview}
            onMakePrincipal={handleMakePrincipal}
          />
        </div>

        <div className="mt-8">
          <GaleriaDropzone
            onFilesSelected={handlePlanosFilesSelected}
            count={planosFiles.length}
            titulo="Fotos de los planos"
          />
          <GaleriaPreviewGrid
            previews={planosPreviews}
            onDelete={handleDeletePlanoPreview}
            onMakePrincipal={() => {}}
          />
        </div>
      </div>

      <InfoBannerBlue>
        Selecciona hasta <strong>40 fotos y 10 planos</strong> (máx. 32 MB cada
        uno) de tu galería.
      </InfoBannerBlue>

      <TipsList title="Ten en cuenta que..." tips={TIPS} />

      <WizardFooter
        onBack={handleBack}
        onContinue={handleContinueClick}
        loading={loading}
        continueLabel={hayFotos ? "Guardar y continuar" : "Continuar sin fotos"}
      />

      <NoPhotosWarningModal
        open={showWarning}
        onClose={handleAddPhotosNow}
        loading={loading}
        onAddPhotosNow={handleAddPhotosNow}
        onContinueAnyway={handleContinueAnyway}
      />
    </div>
  );
};

export default Fotos;
