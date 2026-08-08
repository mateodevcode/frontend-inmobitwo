import { Minus, Plus } from "lucide-react";

const NumberStepper = ({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 99,
  start = 1,
}) => {
  // Arranca en `start` (por defecto 1) pero permite bajar hasta `min` (0).
  const actual = value === null || value === undefined ? start : value;

  const dec = () => onChange(Math.max(min, actual - 1));
  const inc = () => onChange(Math.min(max, actual + 1));

  return (
    <div>
      {(label || description) && (
        <div className="mb-3">
          {label && (
            <label className="block text-xl font-semibold text-slate-900">
              {label}
            </label>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">({description})</p>
          )}
        </div>
      )}
      <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-300">
        <button
          type="button"
          onClick={dec}
          aria-label="Disminuir"
          className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={String(actual)}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d]/g, "");
            onChange(v === "" ? null : Math.min(max, Math.max(min, Number(v))));
          }}
          className="h-12 w-14 border-x border-slate-300 text-center text-base text-slate-900 focus:outline-none"
        />
        <button
          type="button"
          onClick={inc}
          aria-label="Aumentar"
          className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NumberStepper;
