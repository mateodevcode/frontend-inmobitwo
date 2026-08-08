import { Info } from "lucide-react";

const InfoBannerBlue = ({ children }) => {
  return (
    <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3.5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 fill-blue-600 text-blue-50" />
      <p className="text-sm md:text-base text-slate-900">{children}</p>
    </div>
  );
};

export default InfoBannerBlue;
