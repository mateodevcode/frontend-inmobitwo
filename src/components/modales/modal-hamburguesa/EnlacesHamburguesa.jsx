import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { sections } from "@/data/items-nav-hamburguer";

const EnlacesHamburguesa = () => {
  const [expandedSections, setExpandedSections] = useState({
    vender: true,
    alquilar: false,
    comprar: false,
    alquilarBuscar: false,
    hipotecas: false,
    vivienda: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 font-poppins">
        <h1 className="text-xl font-semibold text-gray-900">
          Servicios para ti
        </h1>
      </div>

      {/* Menu items */}
      <div className="divide-y divide-gray-200">
        {sections.map((section) => (
          <div key={section.id}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-semibold text-gray-900">
                {section.title}
              </span>
              {expandedSections[section.id] ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>

            {/* Expanded content */}
            {expandedSections[section.id] && section.links.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200">
                {section.links.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block px-6 py-3 text-blue-600 hover:text-blue-800 hover:bg-gray-100 transition-colors text-base"
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnlacesHamburguesa;
