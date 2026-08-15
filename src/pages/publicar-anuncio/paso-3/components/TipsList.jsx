const TipsList = ({ title, tips }) => {
  return (
    <div className="rounded-md border border-slate-200 px-5 py-5 w-11/12 mx-auto">
      <h3 className="mb-4 text-lg md:text-xl font-bold text-slate-900">
        {title}
      </h3>
      <ul className="flex flex-col gap-4">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <tip.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-slate-700"
              strokeWidth={1.75}
            />
            <p className="text-sm md:text-base text-slate-900">{tip.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsList;
