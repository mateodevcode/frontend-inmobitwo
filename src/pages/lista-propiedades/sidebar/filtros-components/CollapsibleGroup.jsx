import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import CheckboxFiltro from "./CheckboxFiltro";

const CollapsibleGroup = ({
  id,
  label,
  checked,
  onChange,
  subItems = [],
  subValues = [],
  onSubChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between py-1.5">
        <label
          htmlFor={id}
          className="flex items-center gap-2 cursor-pointer select-none text-black/80 hover:text-black"
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-tercero cursor-pointer"
          />
          <span className="text-sm">{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 cursor-pointer text-black/60 hover:text-black"
        >
          <MdKeyboardArrowDown
            className={`text-lg transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="pl-6 border-l border-black/10 ml-2 mb-1">
          {subItems.map((item) => (
            <CheckboxFiltro
              key={item}
              id={`${id}-${item}`}
              label={item}
              checked={subValues.includes(item)}
              onChange={() => onSubChange(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleGroup;
