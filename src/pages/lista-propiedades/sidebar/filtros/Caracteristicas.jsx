import { useSearchParams } from "react-router-dom";
import { SectionTitle, CheckboxFiltro } from "../filtros-components";
import { CARACTERISTICAS_INMUEBLE } from "@/data/caracteristicas_inmueble";

const Caracteristicas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const caract = searchParams.get("caract");
  const seleccionados = (caract ?? "").split(",").filter(Boolean);

  const checked = (opt) => seleccionados.includes(opt.id);

  const toggle = (opt) => {
    const nuevos = new Set(seleccionados);
    if (nuevos.has(opt.id)) nuevos.delete(opt.id);
    else nuevos.add(opt.id);

    const params = new URLSearchParams(searchParams);
    if (nuevos.size) params.set("caract", [...nuevos].join(","));
    else params.delete("caract");
    setSearchParams(params);
  };

  return (
    <div className="mb-6">
      <SectionTitle>Características</SectionTitle>
      {CARACTERISTICAS_INMUEBLE.map((opt) => (
        <CheckboxFiltro
          key={opt.id}
          id={`caract-${opt.id}`}
          label={opt.label}
          checked={checked(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
};

export default Caracteristicas;
