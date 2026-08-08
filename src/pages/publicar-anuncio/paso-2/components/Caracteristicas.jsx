import Bloque from "@/pages/publicar-anuncio/components/Bloque";
import CheckBoxUnico from "@/pages/publicar-anuncio/components/CheckBoxUnico";
import CheckboxGroup from "@/pages/publicar-anuncio/components/CheckboxGroup";
import useDetalles from "@/hooks/useDetalles";

const Caracteristicas = () => {
  const {
    formDataPropiedad,
    setCampo,
    features,
    featuresSel,
    toggleFeature,
    cargandoCatalogos,
  } = useDetalles();

  const categorias = Object.keys(features);

  // Reglas, servicios y tecnología solo aplican para arriendo
  // (ej: "no mascotas", "servicios incluidos", "tv cable").
  const CATEGORIAS_SOLO_ALQUILER = ["rules", "services", "technology"];
  const esAlquiler = formDataPropiedad.operacion === "alquiler";
  const categoriasVisibles = esAlquiler
    ? categorias
    : categorias.filter((c) => !CATEGORIAS_SOLO_ALQUILER.includes(c));

  return (
    <Bloque numero={5} titulo="Características y comodidades">
      <div className="flex max-w-96 flex-col gap-6">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            Comodidades
          </h3>
          <CheckBoxUnico
            checked={!!formDataPropiedad.has_elevator}
            onChange={(c) => setCampo("has_elevator")(c)}
            label="Ascensor"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.has_swimming_pool}
            onChange={(c) => setCampo("has_swimming_pool")(c)}
            label="Piscina"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.has_gym}
            onChange={(c) => setCampo("has_gym")(c)}
            label="Gimnasio"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.has_security_24h}
            onChange={(c) => setCampo("has_security_24h")(c)}
            label="Seguridad 24 horas"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.has_air_conditioning}
            onChange={(c) => setCampo("has_air_conditioning")(c)}
            label="Aire acondicionado"
          />
          <CheckBoxUnico
            checked={!!formDataPropiedad.is_furnished}
            onChange={(c) => setCampo("is_furnished")(c)}
            label="Amoblado / Equipado"
          />
        </div>

        {cargandoCatalogos ? (
          <p className="text-sm text-slate-500">Cargando características…</p>
        ) : categoriasVisibles.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay características disponibles.
          </p>
        ) : (
          categoriasVisibles.map((categoria) => (
            <CheckboxGroup
              key={categoria}
              title={categoria}
              options={features[categoria]}
              values={featuresSel}
              onToggle={toggleFeature}
            />
          ))
        )}
      </div>
    </Bloque>
  );
};

export default Caracteristicas;
