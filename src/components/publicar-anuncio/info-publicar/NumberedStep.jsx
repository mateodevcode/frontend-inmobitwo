export function NumberedStep({ number, title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">
        {number}. {title}
      </h3>
      <div className="text-lg text-slate-900">{children}</div>
    </div>
  );
}
