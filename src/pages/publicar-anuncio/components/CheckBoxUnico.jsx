const CheckBoxUnico = ({
  checked,
  onChange,
  label,
  description,
  className,
}) => {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border border-segundo/10 cursor-pointer select-none hover:bg-segundo/5 ${className ?? ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 appearance-none bg-primero border-2 border-segundo/30 rounded cursor-pointer checked:bg-tercero checked:border-tercero transition-colors shrink-0 box-border"
        style={{
          backgroundImage: checked
            ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l5-5'/%3e%3c/svg%3e")`
            : "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100%",
        }}
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-segundo/50">{description}</p>
        )}
      </div>
    </label>
  );
};

export default CheckBoxUnico;
