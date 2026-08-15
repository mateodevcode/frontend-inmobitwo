import { BsBuildingExclamation } from "react-icons/bs";

const SinAnuncios = () => {
  return (
    <div className="w-full min-h-120 flex items-center flex-col text-black mt-10">
      <div className="w-8/12">
        <p className="text-2xl font-semibold text-center">
          Aún no tienes ningún anuncio publicado
        </p>
        <div className="flex items-center justify-center w-full">
          <div className="bg-stone-100 rounded-full p-8 my-4">
            <BsBuildingExclamation className="text-7xl text-rose-600" />
          </div>
        </div>
        <p className="text-xl mt-4">
          Aprovecha ahora que es totalmente gratis. Publicar tu inmueble solo te
          llevará unos minutos y te permitirá llegar a cientos de personas
          interesadas.
        </p>
        <ul className="list-disc mx-4 text-xl mt-4">
          <li>Publicación 100% gratuita</li>
          <li>Sin comisiones ni permanencia</li>
          <li>Visibilidad inmediata</li>
          <li>Fácil y rápido de publicar</li>
        </ul>
        <p className="mt-4 text-xl">
          ¡No dejes pasar esta oportunidad! Publica tu primer anuncio ahora y
          comienza a recibir ofertas.
        </p>
      </div>
    </div>
  );
};

export default SinAnuncios;
