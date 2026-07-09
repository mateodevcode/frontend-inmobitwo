import { logo } from "@/data/logo";

const HeaderSidebar = () => {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="border-black/10 border rounded-xl w-10 h-10 flex items-center justify-center shadow-xl">
        <img src={logo.src} alt={logo.alt} width={25} height={25} />
      </div>
      <div className="flex flex-col">
        <h2 className="text-black font-semibold font-montserrat">Inmobitwo</h2>
        <p className="text-sm -mt-1.5 text-black/40">Inmobiliaria</p>
      </div>
    </div>
  );
};

export default HeaderSidebar;
