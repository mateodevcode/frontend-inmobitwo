import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";

const OPCIONES = [
  { id: "0", label: "0 alcobas (estudios)" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4 alcobas o más" },
];

const Alcobas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const hab = searchParams.get("hab");
  const seleccionados = (hab ?? "").split(",").filter(Boolean);

  const checked = (opt) => seleccionados.includes(opt.id);

  const toggle = (opt) => {
    const nuevos = new Set(seleccionados);
    if (nuevos.has(opt.id)) nuevos.delete(opt.id);
    else nuevos.add(opt.id);

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("hab", [...nuevos].join(","));
    else params.delete("hab");
    setSearchParams(params);
  };

  return (
    <div className="mb-6">
      <SectionTitle>Alcobas</SectionTitle>
      {OPCIONES.map((opt) => (
        <CheckboxFiltro
          key={opt.id}
          id={`hab-${opt.id}`}
          label={opt.label}
          checked={checked(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
};

export default Alcobas;
