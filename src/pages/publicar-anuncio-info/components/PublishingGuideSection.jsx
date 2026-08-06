import { NumberedStep } from "./NumberedStep";

export function PublishingGuideSection() {
  return (
    <section className="md:py-14 py-8">
      <div className="w-10/12 md:w-9/12 mx-auto">
        <h2 className="mb-2 text-2xl md:text-3xl font-bold text-slate-900">
          ¿Qué pasos seguir para publicar tu anuncio como propietario
          particular?
        </h2>
        <p className="mb-8 text-base md:text-lg text-slate-900">
          Hay 4 puntos clave para vender o alquilar cuanto antes tu inmueble:
        </p>

        <div className="flex flex-col gap-9">
          <NumberedStep
            number={1}
            title="Subir las mejores fotos que tengas y, a ser posible, un plano que refleje la distribución de las estancias"
          >
            <ul className="mb-3 flex flex-col gap-2 pl-1">
              <li className="flex gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Asegúrate de tener fotos de calidad a mano</strong>,
                  al publicar tu anuncio. Si no las tienes, podrás añadirlas más
                  tarde, pero recuerda, sin fotos no tendrás resultados.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>La foto principal es crucial.</strong> Será la portada
                  de tu anuncio, la única que se enviará por mail a los
                  interesados y aparecerá en los listados de resultados.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Ordena tus fotos de forma lógica</strong> para crear
                  una historia atractiva, y opta por imágenes horizontales, que
                  lucen muy bien.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Incluso un plano hecho a mano</strong>, aunque no esté
                  detallado, ofrece información útil para que los interesados
                  visualicen la distribución de las estancias y cómo sería vivir
                  allí.
                </span>
              </li>
            </ul>
            <p>
              Si aún tienes dudas sobre cómo tomar las mejores fotos, puedes
              seguir los trucos y consejos prácticos que compartimos en un video
              sobre{" "}
              <a href="#" className="text-blue-600 hover:underline">
                cómo fotografiar viviendas con tu móvil
              </a>
              .
            </p>
          </NumberedStep>

          <NumberedStep number={2} title="Indicar la dirección exacta">
            <p>
              Para que las personas que buscan en la zona se enteren de tu
              anuncio, es{" "}
              <strong>
                muy importante indicar la dirección correcta del inmueble
              </strong>
              . Si por algún motivo no quieres indicarla tienes a tu disposición
              la posibilidad de <strong>ocultar la dirección por 9,90 €</strong>
              .
            </p>
          </NumberedStep>

          <NumberedStep
            number={3}
            title="Poner un precio acorde con el valor de mercado"
          >
            <p>
              En caso de duda, puedes hacer una{" "}
              <a href="#" className="text-blue-600 hover:underline">
                valoración de tu inmueble gratis
              </a>{" "}
              desde nuestra página o consultar el precio medio en esa zona.
            </p>
          </NumberedStep>

          <NumberedStep
            number={4}
            title="Indicar las características de tu inmueble y describir a fondo tu vivienda"
          >
            <p className="mb-4">
              Incluye información sobre tu inmueble, como el número de
              habitaciones, m2, los baños, etc. También menciona los extras
              adicionales, como la presencia de un ascensor, una terraza, plaza
              de garaje, trastero, etc. Al final,{" "}
              <strong>todos estos detalles suman valor a tu inmueble</strong>.
            </p>
            <p>
              <strong>
                Destaca las características especiales de tu vivienda
              </strong>
              , sobre todo las que no se aprecian en las fotografías. No olvides
              explicar los servicios cercanos, el transporte disponible y los
              lugares de interés en la zona.
            </p>
          </NumberedStep>
        </div>
      </div>
    </section>
  );
}
