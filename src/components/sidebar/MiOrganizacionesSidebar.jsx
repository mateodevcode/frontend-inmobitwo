import { items_organizacion } from "@/data/items_sidebar";

const MiOrganizacionesSidebar = ({ itemSelect, setItemSelect }) => {
  return (
    <div>
      <h3 className="uppercase font-semibold text-xs text-black/60 px-2">
        Mi organización
      </h3>
      <div className="px-2.5 pb-2.5">
        {items_organizacion.map((item, i) => (
          <div
            className={`my-1 p-3 rounded-lg text-sm flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-all duration-75 border text-black ${
              itemSelect === item.label
                ? "bg-stone-100 border-black/10"
                : "border-transparent hover:bg-stone-100 hover:border-black/10"
            }`}
            key={i}
            onClick={() => setItemSelect(item.label)}
          >
            <div className="text-xl">{item.icon}</div>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiOrganizacionesSidebar;
