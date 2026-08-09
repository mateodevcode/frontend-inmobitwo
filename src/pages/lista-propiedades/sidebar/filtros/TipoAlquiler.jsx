import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";

const TIPOS_ALQUILER = [
  { id: 1, label: "Residencial" },
  { id: 2, label: "De temporada" },
  { id: 3, label: "Vacacional" },
];

const TipoAlquiler = ({ operationSlug }) => {
  const esAlquiler =
    operationSlug === "alquiler" || operationSlug === "arriendo";
  const [searchParams, setSearchParams] = useSearchParams();

  const rental = searchParams.get("rental");
  const seleccionados = (rental ?? "").split(",").filter(Boolean);

  const checked = (opt) => seleccionados.includes(String(opt.id));

  const toggle = (opt) => {
    const id = String(opt.id);
    const nuevos = new Set(seleccionados);
    if (nuevos.has(id)) nuevos.delete(id);
    else nuevos.add(id);

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("rental", [...nuevos].join(","));
    else params.delete("rental");
    setSearchParams(params);
  };

  if (!esAlquiler) return null;

  return (
    <div className="mb-6">
      <SectionTitle>Tipo de alquiler</SectionTitle>
      {TIPOS_ALQUILER.map((opt) => (
        <CheckboxFiltro
          key={opt.id}
          id={`alq-${opt.id}`}
          label={opt.label}
          checked={checked(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
};

export default TipoAlquiler;
