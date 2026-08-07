import CheckBoxUnico from "../../components/CheckBoxUnico";

const CheckPublicarPorInmobiliaria = ({
  organizacionNombre,
  checked,
  onChange,
}) => {
  return (
    <CheckBoxUnico
      checked={checked}
      onChange={onChange}
      label={`Publicar como ${organizacionNombre}`}
      description="El anuncio aparecerá bajo el sello de tu inmobiliaria en vez de a título personal"
      className="mt-4 w-96"
    />
  );
};

export default CheckPublicarPorInmobiliaria;
