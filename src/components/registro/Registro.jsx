// src/components/registro/Registro.jsx
import { useAppContext } from "@/context/AppContext.js";
import { logo } from "@/data/logo.js";
import useAuth from "@/hooks/useAuth.js";
import { Link } from "react-router-dom";

const Registro = () => {
  const { handleRegistro, handleChange, formDataUsuario } = useAuth();
  const { loadingAuth } = useAppContext();

  return (
    <div
      className="h-dvh flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: "url('/bg/fondo-registro.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
            <img src={logo.src} alt={logo.alt} width={25} height={25} />
          </div>
          <h2 className="text-white font-semibold font-montserrat text-xl">
            Inmobitwo
          </h2>
        </div>
      </div>
      <div className="w-full max-w-md rounded-2xl p-8 bg-white/80">
        <h1 className="text-xl font-semibold text-black mb-6 font-poppins">
          Crear cuenta en Inmobitwo
        </h1>

        <form onSubmit={handleRegistro} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formDataUsuario.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className="w-full border border-black/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formDataUsuario.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full border border-black/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formDataUsuario.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full border border-black/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Teléfono <span className="text-black/60">(opcional)</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formDataUsuario.telefono}
              onChange={handleChange}
              placeholder="+34 600 000 000"
              className="w-full border border-black/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loadingAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer select-none"
          >
            {loadingAuth ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-black/80 mt-4 text-center font-semibold">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
