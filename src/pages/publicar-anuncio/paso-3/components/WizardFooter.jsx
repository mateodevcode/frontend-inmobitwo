import { ChevronLeft } from "lucide-react";

const WizardFooter = ({ onBack, onContinue, loading, continueLabel }) => {
  return (
    <div className="fixed bottom-0 w-full bg-white left-0">
      <div className="flex items-center justify-between border-t border-slate-200 p-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-base text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft className="h-5 w-5" />
          Volver
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          className="rounded-md border-2 border-tercero px-6 py-3 text-base font-semibold text-tercero hover:text-white hover:bg-tercero active:scale-[0.99] cursor-pointer select-none disabled:opacity-50"
        >
          {loading ? "Guardando..." : continueLabel}
        </button>
      </div>
    </div>
  );
};

export default WizardFooter;
