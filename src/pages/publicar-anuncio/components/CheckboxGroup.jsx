import CheckBoxUnico from "./CheckBoxUnico";

const CheckboxGroup = ({
  title,
  options = [],
  values = [],
  onToggle,
  getLabel = (o) => o.label_es || o.label,
}) => {
  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <CheckBoxUnico
            key={opt.id}
            checked={values.includes(opt.id)}
            onChange={(checked) => onToggle(opt.id, checked)}
            label={getLabel(opt)}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
