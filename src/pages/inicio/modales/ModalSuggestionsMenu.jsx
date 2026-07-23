import { SUGGESTIONS } from "@/data/suggestions.search";
import { useNavigate } from "react-router-dom";

const ModalSuggestionsMenu = ({ setIsOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute z-50 left-0 right-0 -mt-0.5 bg-white border border-black/10 shadow-lg">
      <ul className="py-1">
        {SUGGESTIONS.map(({ id, label, icon: Icon, route }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(route);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-black/80 hover:bg-tercero/3 transition-colors cursor-pointer"
            >
              <Icon className="text-lg text-black/60 shrink-0" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModalSuggestionsMenu;
