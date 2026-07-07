import { MdOutlineWorkOutline } from "react-icons/md";
import { FiFileText } from "react-icons/fi";

const Informacion = () => {
  return (
    <div className="border border-black/10 w-150 mx-auto mt-20 font-montserrat text-black">
      <div className="p-8">
        <h2 className="text-2xl font-bold">Información útil</h2>
        <p className="text-lg mt-2">
          Ten las fotos a mano. Si no las tienes, podrás añadirlas más tarde.
          Sin fotos no tendrás resultados.
        </p>
        <br />
        <p className="text-lg">
          Te regalamos tus primeros dos anuncios para que pruebes nuestro
          servicio. Puedes publicar gratis pisos, chalets, garajes, parcelas,
          locales, etc hasta que lo vendas o lo alquiles.
        </p>
        <br />
        <p className="text-lg">
          Además, puedes publicar hasta 5 habitaciones gratis en piso
          compartido, no suman en el número de anuncios que te regalamos.
        </p>
        <br />
        <p className="text-lg">
          Para poder mantener nuestra calidad de servicio necesitamos cobrar en
          estos casos:
        </p>
        <br />
        <ul className="list-disc mx-4 text-lg">
          <li>anunciantes con más de dos inmuebles</li>
          <li>anuncios de inmuebles duplicados</li>
          <li>inmuebles en venta de más de 1.000.000 €</li>
          <li>inmuebles en alquiler de más de 3.000 €/mes</li>
        </ul>
        <br />
      </div>

      <div className="flex items-center gap-4 border-t border-black/20 p-8">
        <MdOutlineWorkOutline className="text-5xl" />
        <div>
          <p className="font-semibold text-lg">
            ¿Eres profesional inmobiliario?
          </p>
          <p className="text-blue-600 hover:underline cursor-pointer select-none">
            Conoce nuestras ventajas para profesionales
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-black/20 p-8">
        <FiFileText className="text-5xl" />
        <div>
          <p className="font-semibold text-lg">
            ¿Necesitas un contrato de alquiler?
          </p>
          <p className="text-blue-600 hover:underline cursor-pointer select-none">
            crea tu contrato de alquiler 100% legak y gratis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Informacion;
