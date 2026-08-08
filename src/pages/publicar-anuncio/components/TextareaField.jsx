const TextareaField = ({
  label,
  description,
  value,
  onChange,
  rows = 12,
  placeholder,
}) => {
  return (
    <div>
      <div className="mb-3">
        <label className="block text-xl font-semibold text-slate-900">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">({description})</p>
        )}
      </div>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-96 resize-y rounded-md border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 transition-colors hover:border-rose-600/50 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-600"
      />
    </div>
  );
};

export default TextareaField;
