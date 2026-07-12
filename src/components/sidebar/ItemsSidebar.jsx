import { items_sidebar } from "@/data/items_sidebar";
import { useNavigate } from "react-router-dom";

const ItemsSidebar = ({ itemSelect, setItemSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="p-2.5">
      {items_sidebar.map((item, i) => (
        <div
          className={`my-1 p-3 rounded-lg text-sm flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-all duration-75 border text-black relative ${
            itemSelect === item.label
              ? "bg-stone-100 border-black/10"
              : "border-transparent hover:bg-stone-100 hover:border-black/10"
          }`}
          key={i}
          onClick={() => {
            setItemSelect(item.label);
            navigate(item.url);
          }}
        >
          <div className="text-xl">{item.icon}</div>
          {item.name}
          {item.label === "mensajes" && (
            <div className="bg-[#FF1B1C] w-6 h-6 rounded-full flex items-center justify-center font-semibold text-white absolute right-3">
              3
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemsSidebar;
