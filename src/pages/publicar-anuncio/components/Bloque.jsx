import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const Bloque = ({ numero, titulo, children, defaultOpen = true }) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="w-96 rounded-md">
          <DisclosureButton className="flex w-full cursor-pointer items-center justify-between gap-4 pr-4 py-4 text-left">
            <span className="text-xl font-bold text-slate-900">
              {numero ? `${numero}. ` : ""}
              {titulo}
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-black/80 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </DisclosureButton>
          <DisclosurePanel className="pb-5 pt-1">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

export default Bloque;
