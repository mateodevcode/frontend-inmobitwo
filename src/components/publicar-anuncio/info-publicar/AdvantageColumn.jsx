export function AdvantageColumn({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-base md:text-xl font-bold text-slate-900">
        {title}
      </h3>
      <p className="text-base md:text-lg text-slate-900">{children}</p>
    </div>
  );
}
