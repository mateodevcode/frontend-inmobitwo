const RadioFiltro = ({ id, name, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 py-1.5 cursor-pointer select-none text-black/80 hover:text-black"
  >
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-tercero cursor-pointer"
    />
    <span className="text-sm">{label}</span>
  </label>
);

export default RadioFiltro;
