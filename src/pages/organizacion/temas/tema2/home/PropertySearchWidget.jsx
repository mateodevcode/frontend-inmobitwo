import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, SlidersHorizontal, Search } from "lucide-react";

const TABS = ["Buy", "Sell", "Rent"];

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Studio",
];
const ROOM_TYPES = [
  "Studio",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];
const MIN_AREAS = [
  "500 sqft",
  "750 sqft",
  "1000 sqft",
  "1500 sqft",
  "2000 sqft",
];
const MAX_AREAS = [
  "1000 sqft",
  "1500 sqft",
  "2500 sqft",
  "4000 sqft",
  "6000 sqft",
];
const BEDROOMS = ["1", "2", "3", "4", "5+"];
const LOCATIONS = ["Downtown", "Marina", "Hillside", "Old Town", "Suburbs"];

const PRICE_MIN = 125000;
const PRICE_MAX = 825000;

const formatPrice = (value) => `$${value.toLocaleString("en-US")}`;

// Single-select dropdown, closes on outside click / Escape.
function Dropdown({ label, placeholder, options }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 min-w-0" ref={ref}>
      <label className="text-[13px] font-medium text-neutral-800">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`w-full flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm text-left transition-colors duration-200
            ${open ? "border-[#FF1B1C] bg-white" : "border-transparent bg-neutral-100 hover:bg-neutral-200/70"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1B1C]/40`}
        >
          <span className={value ? "text-neutral-900" : "text-neutral-500"}>
            {value ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180 text-[#FF1B1C]" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg shadow-black/5"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                    ${value === opt ? "text-[#FF1B1C] bg-[#FFF1F0]" : "text-neutral-700 hover:bg-neutral-50"}`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Dual-handle price range slider.
function PriceRangeSlider() {
  const [minVal, setMinVal] = useState(PRICE_MIN);
  const [maxVal, setMaxVal] = useState(PRICE_MAX);

  const percent = useCallback(
    (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
    [],
  );

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), maxVal - 5000);
    setMinVal(v);
  };
  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), minVal + 5000);
    setMaxVal(v);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-neutral-800">
        Price Range
      </label>
      <div className="relative h-3 flex items-center px-1">
        <div className="absolute left-1 right-1 h-1 rounded-full bg-neutral-200" />
        <div
          className="absolute h-1 rounded-full bg-[#FF1B1C]"
          style={{
            left: `${percent(minVal)}%`,
            right: `${100 - percent(maxVal)}%`,
          }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5000}
          value={minVal}
          onChange={handleMinChange}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5000}
          value={maxVal}
          onChange={handleMaxChange}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
          aria-label="Maximum price"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-600">
        <span>{formatPrice(minVal)}</span>
        <span className="text-neutral-300">—</span>
        <span>{formatPrice(maxVal)}</span>
      </div>

      <style>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #FF1B1C;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          cursor: pointer;
          margin-top: -1px;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #FF1B1C;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track { background: transparent; }
        .range-thumb::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
}

export default function PropertySearchWidget({ className = "" }) {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div
      className={`relative z-10 w-11/12 max-w-6xl mx-auto rounded-md bg-white shadow-2xl shadow-black/30 overflow-hidden font-sans -mt-1.5`}
    >
      <div className="h-1.5 w-full bg-[#FF1B1C]" />

      <div className="p-6 md:p-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200
                ${
                  activeTab === tab
                    ? "bg-[#FF1B1C] text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 items-end">
          <Dropdown
            label="Property Type"
            placeholder="Select Property Type"
            options={PROPERTY_TYPES}
          />
          <Dropdown
            label="Room Type"
            placeholder="Select Room Type"
            options={ROOM_TYPES}
          />
          <Dropdown
            label="Min Area (Sqft)"
            placeholder="Select Area"
            options={MIN_AREAS}
          />
          <Dropdown
            label="Max Area (Sqft)"
            placeholder="Select Max Area"
            options={MAX_AREAS}
          />
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 transition-colors duration-200"
          >
            Advanced Search
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 items-end mt-6">
          <Dropdown
            label="Max of Bedrooms"
            placeholder="Select Max Bedrooms"
            options={BEDROOMS}
          />
          <Dropdown
            label="Max of Bathrooms"
            placeholder="Select Max Bathrooms"
            options={BEDROOMS}
          />
          <Dropdown
            label="Location"
            placeholder="Select Location"
            options={LOCATIONS}
          />
          <PriceRangeSlider />
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#FF1B1C] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#e01617] transition-colors duration-200"
          >
            <Search size={15} />
            Search Property
          </button>
        </div>
      </div>
    </div>
  );
}
