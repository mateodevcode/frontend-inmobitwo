import { useState } from "react";
import { LANGUAGES } from "@/data/info-publicar";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export function LanguageSelect() {
  const [selected, setSelected] = useState(LANGUAGES[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="relative w-48">
          <ListboxButton
            className={`flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2.5 text-base text-slate-900 focus:outline-none ${
              open ? "border-slate-900" : "border-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{selected.flag}</span>
              <span>{selected.label}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            transition
            className="z-50 mt-1 w-(--button-width)] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg transition duration-100 ease-out data-leave:opacity-0 data-closed:opacity-0"
          >
            {LANGUAGES.map((lang) => (
              <ListboxOption
                key={lang.id}
                value={lang}
                className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-base text-slate-900 data-focus:bg-slate-50 data-selected:font-semibold"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}
