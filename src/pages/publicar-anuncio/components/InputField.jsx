const InputField = ({
  label,
  description,
  value,
  onChange,
  placeholder,
  type = "text",
  unit,
  numeric,
  readOnly,
}) => {
  const handleChange = (e) => {
    if (!numeric) return onChange(e);
    // Solo números (entero). Descarta cualquier otro carácter.
    const cleaned = e.target.value.replace(/[^\d]/g, "");
    onChange({ ...e, target: { ...e.target, value: cleaned } });
  };

  return (
    <div>
      <div className="mb-3">
        <label className="block text-lg font-semibold text-segundo/80">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-sm text-segundo/20">({description})</p>
        )}
      </div>
      <div className="relative w-96">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          inputMode={numeric ? "numeric" : undefined}
          readOnly={readOnly}
          className={`w-full rounded-md border border-segundo/20 bg-primero px-4 py-3 text-base text-segundo/80 transition-colors hover:border-tercero/50 focus:border-tercero focus:outline-none focus:ring-1 focus:ring-tercero ${
            unit ? "pr-14" : ""
          } ${readOnly ? "cursor-default bg-primero text-segundo/30" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base text-segundo/30">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
