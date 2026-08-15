import { RadioGroup, Radio, Label, Description } from "@headlessui/react";

const RadioGroupInput = ({
  label,
  options = [],
  value,
  onChange,
  getDisabled = () => false,
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <h2 className="mb-2 text-xl font-semibold text-slate-900">{label}</h2>
      )}
      <RadioGroup value={value} onChange={onChange} className="flex flex-col">
        {options.map((opt) => (
          <Radio
            key={opt.id}
            value={opt}
            disabled={getDisabled(opt)}
            className="group flex cursor-pointer items-start gap-3 py-2 data-disabled:cursor-not-allowed data-disabled:opacity-40"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-segundo/70 transition-colors group-data-checked:border-tercero">
              <span className="h-2.5 w-2.5 rounded-full bg-tercero opacity-0 group-data-checked:opacity-100" />
            </span>
            <span>
              <Label
                as="p"
                className="text-base text-segundo/80 group-data-checked:text-tercero"
              >
                {opt.label}
              </Label>
              {opt.description && (
                <Description as="p" className="mt-0.5 text-sm text-segundo/60">
                  {opt.description}
                </Description>
              )}
            </span>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioGroupInput;
