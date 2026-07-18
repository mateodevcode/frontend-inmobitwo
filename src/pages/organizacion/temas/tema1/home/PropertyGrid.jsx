import { useState, useMemo } from "react";
import { PiHeart, PiHeartFill, PiMapPinLine } from "react-icons/pi";
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

const CATEGORIES = [
  "View All",
  "Apartment",
  "Commercial",
  "Land Or Plot",
  "Farm",
];
const INITIAL_VISIBLE = 4;
const LOAD_STEP = 4;

const properties = [
  {
    id: 1,
    title: "Charming Beach House",
    location: "39581 Rohan Estates, New York",
    price: 179800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    category: "Apartment",
    image: "https://picsum.photos/id/1080/800/600",
  },
  {
    id: 2,
    title: "Contemporary Loft",
    location: "39581 Rohan Estates, New York",
    price: 335800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    category: "Apartment",
    image: "https://picsum.photos/id/1074/800/600",
  },
  {
    id: 3,
    title: "Cozy Cottage",
    location: "39581 Rohan Estates, New York",
    price: 250800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    category: "Farm",
    image: "https://picsum.photos/id/1073/800/600",
  },
  {
    id: 4,
    title: "Modern Beach House",
    location: "39581 Rohan Estates, New York",
    price: 189800,
    beds: 4,
    baths: 2,
    sqft: 1500,
    category: "Commercial",
    image: "https://picsum.photos/id/1076/800/600",
  },
  {
    id: 5,
    title: "Luxury Hillside Villa",
    location: "39581 Rohan Estates, New York",
    price: 420000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    category: "Land Or Plot",
    image: "https://picsum.photos/id/1031/800/600",
  },
  {
    id: 6,
    title: "Skyline Penthouse",
    location: "39581 Rohan Estates, New York",
    price: 560000,
    beds: 3,
    baths: 3,
    sqft: 2100,
    category: "Apartment",
    image: "https://picsum.photos/id/1029/800/600",
  },
  {
    id: 7,
    title: "Rustic Farmhouse",
    location: "39581 Rohan Estates, New York",
    price: 210500,
    beds: 4,
    baths: 2,
    sqft: 1800,
    category: "Farm",
    image: "https://picsum.photos/id/1040/800/600",
  },
  {
    id: 8,
    title: "Downtown Office Loft",
    location: "39581 Rohan Estates, New York",
    price: 610000,
    beds: 2,
    baths: 2,
    sqft: 2600,
    category: "Commercial",
    image: "https://picsum.photos/id/1048/800/600",
  },
];

const formatPrice = (value) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SaleTagIcon = () => (
  <svg
    width="26"
    height="18"
    viewBox="0 0 26 18"
    fill="none"
    className="absolute -top-4 left-4"
  >
    <path
      d="M2 16 L13 2 L24 16"
      stroke="#94a3b8"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="13" cy="2" r="2.5" fill="#ef4444" />
  </svg>
);

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Imagen */}
      <div className="relative h-56">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4">
          <SaleTagIcon />
          <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md">
            For Sale
          </span>
        </div>

        <button
          onClick={() => setIsFavorite((prev) => !prev)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Guardar en favoritos"
        >
          {isFavorite ? (
            <PiHeartFill className="text-red-500 text-lg" />
          ) : (
            <PiHeart className="text-gray-700 text-lg" />
          )}
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <PiMapPinLine className="text-red-500 shrink-0" />
          {property.location}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 mt-4 pt-4">
          <span className="flex items-center gap-1.5">
            <FaBed className="text-gray-400" /> Bed {property.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <FaBath className="text-gray-400" /> Bath {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <BiArea className="text-gray-400" /> {property.sqft} sqft
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-4">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
          <button className="text-sm font-medium border border-gray-300 rounded-sm px-4 py-2 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyGrid = () => {
  const [activeCategory, setActiveCategory] = useState("View All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filtered = useMemo(
    () =>
      activeCategory === "View All"
        ? properties
        : properties.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  const visibleProperties = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE);
  };

  return (
    <div className="bg-stone-50 w-full py-16">
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-10 h-6 flex flex-col gap-1 items-end justify-center">
              <div className="h-0.5 w-3 bg-black" />
              <div className="h-0.5 w-6 bg-rose-600" />
            </div>
            <h3 className="text-red-500 font-semibold">
              Propiedades Populares
            </h3>
            <div className="w-10 h-6 flex flex-col gap-1 justify-center">
              <div className="h-0.5 w-3 bg-black" />
              <div className="h-0.5 w-6 bg-rose-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Best Properties Sale
          </h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative flex items-center gap-2 px-4 bg-gray-100 text-black h-9 cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-black before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0`}
            >
              <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300">
                {category}
              </p>
            </button>
          ))}
        </div>

        {/* Grid de propiedades */}
        {visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay propiedades en esta categoría.
          </p>
        )}

        {/* Ver más / Ver menos */}
        {(hasMore || visibleCount > INITIAL_VISIBLE) && (
          <div className="flex justify-center mt-10">
            {hasMore ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + LOAD_STEP)}
                className="text-sm font-semibold px-6 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Load More
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(INITIAL_VISIBLE)}
                className="text-sm font-semibold px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:border-gray-900 transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGrid;
