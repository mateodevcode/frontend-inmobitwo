const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-3 block text-xl font-semibold text-slate-900">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-96 rounded-md border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 transition-colors hover:border-rose-600/50 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-600"
      />
    </div>
  );
};

export default InputField;
