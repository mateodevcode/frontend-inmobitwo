const SkeletonDetalleAnuncio = () => {
  return (
    <div className="flex flex-col font-montserrat relative items-center mb-20 animate-pulse">
      {/* Header fake */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-between p-2 md:p-4 w-10/12">
          <div className="h-8 w-56 bg-stone-200 rounded" />
          <div className="h-12 w-48 bg-stone-200 rounded-md" />
        </div>
      </div>

      {/* Datos principales */}
      <div className="w-full py-5">
        <div className="w-10/12 mx-auto">
          <div className="h-8 w-2/3 bg-stone-200 rounded mb-4" />
          <div className="h-10 w-72 bg-stone-200 border border-black/10" />
          <div className="h-6 w-1/3 bg-stone-200 rounded mt-4" />
          <div className="h-11 w-48 bg-stone-200 rounded-md mt-8" />
        </div>
      </div>

      {/* Precio y características */}
      <SkeletonCard>
        <div className="h-6 w-56 bg-stone-200 rounded" />
        <div className="flex items-center gap-4 mt-4">
          <div className="h-5 w-20 bg-stone-200 rounded" />
          <div className="h-5 w-16 bg-stone-200 rounded" />
          <div className="h-5 w-16 bg-stone-200 rounded" />
          <div className="h-5 w-20 bg-stone-200 rounded" />
        </div>
        <div className="h-5 w-64 bg-stone-200 rounded mt-6" />
      </SkeletonCard>

      {/* Fotos y vídeos */}
      <SkeletonCard>
        <div className="h-6 w-40 bg-stone-200 rounded" />
        <div className="h-20 w-full bg-stone-200 mt-4" />
        <div className="h-5 w-72 bg-stone-200 rounded mt-6" />
      </SkeletonCard>

      {/* Estadísticas */}
      <SkeletonCard>
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="h-5 w-52 bg-stone-200 rounded mt-4" />
        <div className="flex items-center gap-8 mt-4">
          <div className="h-6 w-20 bg-stone-200 rounded" />
          <div className="h-6 w-20 bg-stone-200 rounded" />
          <div className="h-6 w-20 bg-stone-200 rounded" />
        </div>
      </SkeletonCard>

      {/* Forma de contacto */}
      <SkeletonCard>
        <div className="h-6 w-48 bg-stone-200 rounded" />
        <div className="flex flex-col gap-6 mt-8">
          <div className="w-full flex items-center justify-between">
            <div className="h-5 w-32 bg-stone-200 rounded" />
            <div className="h-5 w-16 bg-stone-200 rounded" />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="h-5 w-40 bg-stone-200 rounded" />
            <div className="h-5 w-16 bg-stone-200 rounded" />
          </div>
        </div>
        <div className="h-5 w-36 bg-stone-200 rounded mt-8" />
      </SkeletonCard>

      {/* Dirección */}
      <SkeletonCard>
        <div className="h-6 w-24 bg-stone-200 rounded" />
        <div className="h-5 w-full bg-stone-200 rounded mt-4" />
      </SkeletonCard>

      {/* Descripción */}
      <SkeletonCard>
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="h-5 w-2/3 bg-stone-200 rounded mt-4" />
        <div className="h-5 w-44 bg-stone-200 rounded mt-6" />
      </SkeletonCard>

      {/* Servicios */}
      <SkeletonCard>
        <div className="h-6 w-64 bg-stone-200 rounded" />
        <div className="h-5 w-56 bg-stone-200 rounded mt-4" />
      </SkeletonCard>
    </div>
  );
};

// Pequeño wrapper para no repetir las clases del contenedor de cada sección
const SkeletonCard = ({ children }) => (
  <div className="w-10/12">
    <div className="w-2/3 bg-stone-50 shadow-sm shadow-black/20 p-8 flex flex-col justify-between border border-black/10 mt-8">
      {children}
    </div>
  </div>
);

export default SkeletonDetalleAnuncio;
