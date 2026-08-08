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
        <label className="block text-lg font-semibold text-slate-900">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">({description})</p>
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
          className={`w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 transition-colors hover:border-rose-600/50 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-600 ${
            unit ? "pr-14" : ""
          } ${readOnly ? "cursor-default bg-slate-100 text-slate-600" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
