const neighborhoods = [
  {
    id: 1,
    city: "Cape Town, South Africa",
    count: "42 Properties",
    image: "https://picsum.photos/id/1080/900/1200",
    size: "large",
  },
  {
    id: 2,
    city: "Sydney, Australia",
    count: "34 Properties",
    image: "https://picsum.photos/id/1076/900/600",
    size: "wide",
  },
  {
    id: 3,
    city: "Los Angeles, New York",
    count: "55 Properties",
    image: "https://picsum.photos/id/1060/600/600",
    size: "small",
  },
  {
    id: 4,
    city: "Seoul, South Korea",
    count: "25 Properties",
    image: "https://picsum.photos/id/1029/600/600",
    size: "small",
  },
];

const NeighborhoodCard = ({ item, className = "" }) => (
  <div className={`relative rounded-3xl overflow-hidden group ${className}`}>
    <img
      src={item.image}
      alt={item.city}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

    <div className="absolute bottom-6 left-6 text-white">
      <p className="text-sm font-medium mb-1">{item.count}</p>
      <h3 className="text-2xl font-bold">{item.city}</h3>
    </div>
  </div>
);

const NeighborhoodsSection = () => {
  const [big, wide, ...small] = neighborhoods;

  return (
    <div className="w-full bg-stone-50 py-16">
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-red-500" />
              <h3 className="text-red-500 text-sm font-semibold">
                Explore Cities
              </h3>
              <div className="w-8 h-px bg-red-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Explore The Neighborhoods
            </h2>
            <p className="text-gray-500 mt-2">
              Find your dream apartment with our listing
            </p>
          </div>

          <button className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-300 text-gray-900 hover:border-gray-900 transition-colors whitespace-nowrap self-start sm:self-auto">
            Browse All Now
          </button>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-6 h-auto lg:h-150">
          <NeighborhoodCard item={big} className="row-span-2 h-100 lg:h-auto" />
          <NeighborhoodCard item={wide} className="h-70 lg:h-auto" />

          <div className="grid grid-cols-2 gap-6">
            {small.map((item) => (
              <NeighborhoodCard
                key={item.id}
                item={item}
                className="h-55 lg:h-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodsSection;
