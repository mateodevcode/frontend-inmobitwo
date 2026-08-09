import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";
import { ESTADOS_INMUEBLE } from "@/data/estados_inmueble";

const Estado = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const estado = searchParams.get("estado");
  const seleccionados = (estado ?? "").split(",").filter(Boolean);

  const checked = (opt) => seleccionados.includes(opt.id);

  const toggle = (opt) => {
    const nuevos = new Set(seleccionados);
    if (nuevos.has(opt.id)) nuevos.delete(opt.id);
    else nuevos.add(opt.id);

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("estado", [...nuevos].join(","));
    else params.delete("estado");
    setSearchParams(params);
  };

  return (
    <div className="mb-6">
      <SectionTitle>Estado</SectionTitle>
      {ESTADOS_INMUEBLE.map((opt) => (
        <CheckboxFiltro
          key={opt.id}
          id={`estado-${opt.id}`}
          label={opt.label}
          checked={checked(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
};

export default Estado;
