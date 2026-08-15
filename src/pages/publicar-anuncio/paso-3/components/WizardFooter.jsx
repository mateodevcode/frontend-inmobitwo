import { ChevronLeft } from "lucide-react";
import { irArriba } from "@/utils/irArriba";

const WizardFooter = ({ onBack, onContinue, loading, continueLabel }) => {
  return (
    <div className="fixed bottom-0 w-full bg-primero left-0">
      <div className="flex items-center justify-between border-t border-black/10 px-5 py-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-base text-black/80 hover:text-black/60 cursor-pointer select-none font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          Volver
        </button>

        <button
          type="button"
          onClick={async (e) => {
            onContinue(e);
            await new Promise((resolve) => setTimeout(resolve, 50));
            irArriba();
          }}
          disabled={loading}
          className="rounded-md border-2 border-tercero px-5 py-2.5 text-sm font-semibold text-tercero hover:text-white hover:bg-tercero active:scale-[0.99] cursor-pointer select-none disabled:opacity-50 transition duration-300"
        >
          {loading ? "Guardando..." : continueLabel}
        </button>
      </div>
    </div>
  );
};

export default WizardFooter;
