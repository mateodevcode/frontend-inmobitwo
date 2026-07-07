export function ServiceCard({ title, children, linkLabel, href = "#" }) {
  return (
    <div className="rounded-md bg-white p-6">
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mb-4 text-lg text-slate-900">{children}</p>
      <a
        href={href}
        className="text-lg font-semibold text-blue-600 hover:underline"
      >
        {linkLabel}
      </a>
    </div>
  );
}
