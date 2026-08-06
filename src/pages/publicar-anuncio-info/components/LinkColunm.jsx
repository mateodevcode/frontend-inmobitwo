export function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-base md:text-xl font-bold text-slate-900">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((label, i) => (
          <li key={i}>
            <a
              href="#"
              className="text-base md:text-lg text-blue-600 hover:underline"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
