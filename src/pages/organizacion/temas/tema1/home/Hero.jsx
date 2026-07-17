import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { VscStarFull } from "react-icons/vsc";
import PropertyMap from "./PropertyMap";

const Hero = () => {
  return (
    <div className="h-[85svh] w-full bg-rose-50 flex items-center justify-center font-poppins relative">
      <div className="w-11/12 flex items-center justify-center">
        {/* left */}
        <div className="w-[55%] ml-28">
          <div className="flex items-center gap-2">
            <div className="w-10 h-6 flex flex-col gap-1 items-end justify-center">
              <div className="h-0.5 w-3 bg-black"></div>
              <div className="h-0.5 w-6 bg-rose-600"></div>
            </div>
            <h3 className="text-rose-600 text-xl font-bold">
              Bienvenido a Inmobitwo
            </h3>
            <div className="w-10 h-6  flex flex-col gap-1 justify-center">
              <div className="h-0.5 w-3 bg-black"></div>
              <div className="h-0.5 w-6 bg-rose-600"></div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-6xl font-bold text-black">Find Your Perfect</h3>
            <h3 className="text-6xl font-bold text-black">
              <span className="text-rose-600">Home</span> to Life Spend
            </h3>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button className="px-4 py-3 bg-black text-white font-semibold rounded-md">
              Comprar
            </button>
            <button className="px-4 py-3 hover:bg-black hover:text-white text-black duration-300 transition font-semibold rounded-md border border-black/20 bg-transparent">
              Vender
            </button>
          </div>

          <div className="bg-white rounded-md flex items-center gap-2 px-3 py-2 mt-4 w-min">
            <div>
              <p className="text-black text-sm font-semibold select-none">
                Keyword
              </p>
              <input
                type="text"
                placeholder="Looking For?"
                className="w-30 text-sm outline-none border-none bg-transparent ring-0 focus:outline-none focus:ring-0 focus:border-none"
              />
            </div>

            <div className="w-px h-8 bg-black/20 mr-5" />

            <div>
              <p className="text-black text-sm font-semibold select-none">
                Location
              </p>
              <input
                type="text"
                placeholder="Find a location"
                className="w-30 text-sm outline-none border-none bg-transparent ring-0 focus:outline-none focus:ring-0 focus:border-none"
              />
            </div>

            <div className="w-px h-8 bg-black/20 mr-5" />

            <div>
              <p className="text-black text-sm font-semibold select-none">
                Pricing
              </p>
              <input
                type="text"
                placeholder="$0 - $2000"
                className="w-30 text-sm outline-none border-none bg-transparent ring-0 focus:outline-none focus:ring-0 focus:border-none"
              />
            </div>

            <div className="w-px h-8 bg-black/20 mr-5" />

            <div className="flex items-center gap-4">
              <button className="relative flex items-center gap-2 px-4 bg-gray-100 text-black h-9 rounded-md cursor-pointer select-none overflow-hidden group before:absolute before:inset-0 before:bg-black before:w-0 hover:before:w-full before:transition-all before:duration-500 before:ease-in-out before:z-0">
                <p className="text-sm relative z-10 group-hover:text-white transition-colors duration-300">
                  Advance
                </p>

                <MdOutlineSettingsInputComponent className="text-sm relative z-10 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-rose-600/20 bg-rose-600 text-white cursor-pointer select-none hover:bg-rose-700 duration-300 transition">
                <BsSearch className="text-sm" />
                <p className="text-sm">Search</p>
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-16">
            <div>
              <p className="text-5xl font-semibold text-black">1950 +</p>
              <div className="flex flex-col mt-2">
                <p className="text-black/50">Project</p>
                <p className="text-black/50">Handover</p>
              </div>
            </div>

            <div>
              <p className="text-5xl font-semibold text-black">2M +</p>
              <div className="flex flex-col mt-2">
                <p className="text-black/50">Monthly</p>
                <p className="text-black/50">Visitors</p>
              </div>
            </div>

            <div>
              <p className="text-5xl font-semibold text-black">850 +</p>
              <div className="flex flex-col mt-2">
                <p className="text-black/50">Property</p>
                <p className="text-black/50">Ready</p>
              </div>
            </div>

            <div>
              <p className="text-5xl font-semibold text-black">98 %</p>
              <div className="flex flex-col mt-2">
                <p className="text-black/50">Happy</p>
                <p className="text-black/50">Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="w-[45%]">
          <div className="w-full h-150">
            <PropertyMap />
          </div>
        </div>
      </div>

      <div className="animate-spin absolute left-8 bottom-8 [animation-duration:5s]">
        <VscStarFull className="text-7xl text-black" />
      </div>
    </div>
  );
};

export default Hero;
