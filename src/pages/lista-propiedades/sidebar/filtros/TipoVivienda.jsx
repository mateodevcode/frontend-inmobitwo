import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";
import { CATEGORIAS_VIVIENDA } from "@/data/tipos_vivienda";

const TipoVivienda = ({ operationSlug }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const esAlquiler =
    operationSlug === "alquiler" || operationSlug === "arriendo";

  // Habitaciones solo aplica en alquiler (no se compra una habitación)
  const categorias = esAlquiler
    ? CATEGORIAS_VIVIENDA
    : CATEGORIAS_VIVIENDA.filter((c) => !c.soloAlquiler);

  const tipos = searchParams.get("tipos");
  const seleccionados = (tipos ?? "").split(",").filter(Boolean);

  const checked = (cat) =>
    cat.tipos.split(",").every((t) => seleccionados.includes(t));

  const toggle = (cat) => {
    const tiposCat = cat.tipos.split(",");
    const nuevos = new Set(seleccionados);
    const todosEn = tiposCat.every((t) => seleccionados.includes(t));

    if (todosEn) {
      tiposCat.forEach((t) => nuevos.delete(t));
    } else {
      tiposCat.forEach((t) => nuevos.add(t));
    }

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("tipos", [...nuevos].join(","));
    else params.delete("tipos");
    setSearchParams(params);
  };

  return (
    <div className="mb-6">
      <SectionTitle>Tipo de vivienda</SectionTitle>
      {categorias.map((cat) => (
        <CheckboxFiltro
          key={cat.id}
          id={`vv-${cat.id}`}
          label={cat.label}
          checked={checked(cat)}
          onChange={() => toggle(cat)}
        />
      ))}
    </div>
  );
};

export default TipoVivienda;
