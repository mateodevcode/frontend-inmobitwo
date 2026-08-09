import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";

const OPCIONES = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3 baños o más" },
];

const Banos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const banos = searchParams.get("banos");
  const seleccionados = (banos ?? "").split(",").filter(Boolean);

  const checked = (opt) => seleccionados.includes(opt.id);

  const toggle = (opt) => {
    const nuevos = new Set(seleccionados);
    if (nuevos.has(opt.id)) nuevos.delete(opt.id);
    else nuevos.add(opt.id);

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("banos", [...nuevos].join(","));
    else params.delete("banos");
    setSearchParams(params);
  };

  return (
    <div className="mb-6">
      <SectionTitle>Baños</SectionTitle>
      {OPCIONES.map((opt) => (
        <CheckboxFiltro
          key={opt.id}
          id={`banos-${opt.id}`}
          label={opt.label}
          checked={checked(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
};

export default Banos;
