import { MdOutlineConstruction } from "react-icons/md";
import { logo } from "@/data/logo";

const EnConstruccion = ({ title = "Esta sección" }) => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center gap-8 font-poppins px-4">
      <div className="flex items-center gap-2 select-none">
        <div className="w-9 h-9">
          <img
            src={logo.src}
            alt={logo.alt}
            className="object-center w-full h-full"
          />
        </div>
        <span className="text-2xl md:text-3xl font-black tracking-tight text-black font-bold">
          inmobitwo
        </span>
      </div>
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-tercero/10 flex items-center justify-center">
          <MdOutlineConstruction className="text-tercero text-2xl" />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-cuarto mb-2">
          {title} se está trabajando
        </h1>
        <p className="text-cuarto/60 text-sm mb-6">
          Suscríbete a nuestro boletín y te avisamos cuando esté lista.
        </p>

        <form className="flex items-stretch gap-2">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            className="flex-1 h-11 px-4 bg-white border border-black/15 rounded-sm text-sm outline-none placeholder:text-black/40"
          />
          <button
            type="submit"
            className="h-11 px-6 bg-cuarto text-white text-sm font-semibold rounded-sm hover:bg-black transition-colors"
          >
            Avísame
          </button>
        </form>
      </div>
      <a href="/" className="hover:text-blue-700 text-cuarto">
        Volver a inicio
      </a>
    </div>
  );
};

export default EnConstruccion;
