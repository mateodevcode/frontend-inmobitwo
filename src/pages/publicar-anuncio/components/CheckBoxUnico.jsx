const CheckBoxUnico = ({ checked, onChange, label, description, className }) => {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border border-black/10 cursor-pointer select-none hover:bg-stone-50 ${className ?? ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-6 h-6 accent-tercero"
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-black/50">{description}</p>}
      </div>
    </label>
  );
};

export default CheckBoxUnico;
