// src/components/registro/Registro.jsx
import { useAppContext } from "@/context/AppContext.js";
import useAuth from "@/hooks/useAuth.js";
import { Link } from "react-router-dom";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import Logo from "../logo/Logo";

const Registro = () => {
  const { handleRegistro, handleChange, formDataUsuario } = useAuth();
  const { loadingAuth } = useAppContext();

  return (
    <div className="h-dvh flex items-center justify-center px-4 relative bg-gray-100">
      <div className="max-w-md min-w-sm p-8 bg-white/80">
        <div className="flex items-center justify-center mb-4">
          <Logo />
        </div>
        <h1 className="text-xl text-black mb-6 font-poppins text-center">
          Crear cuenta en Inmobitwo
        </h1>

        <form onSubmit={handleRegistro} className="flex flex-col gap-3">
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
              className="w-full border border-black/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black/60 text-black"
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
              className="w-full border border-black/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black/60 text-black"
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
              placeholder="Mínimo 8 caracteres"
              required
              className="w-full border border-black/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black/60 text-black"
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
              className="w-full border border-black/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black/60 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loadingAuth}
            className="bg-tercero hover:bg-tercero/80 text-white rounded-md font-semibold py-2.5 transition disabled:opacity-50 cursor-pointer select-none"
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

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default Registro;
