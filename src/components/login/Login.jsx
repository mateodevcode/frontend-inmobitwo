// src/components/login/Login.jsx
import { useEffect, useState } from "react";
import { logo } from "@/data/logo";
import { skills_data } from "@/data/skills_data";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { useAppContext } from "@/context/AppContext";
import { SlSocialGoogle } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";
import { irArriba } from "../../utils/irArriba";

const Login = () => {
  const { handleLogin, handleChange, formDataUsuario } = useAuth();
  const { loadingAuth } = useAppContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  // Generar nuevas posiciones aleatorias cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 70) - 10; // rango en vw
      const randomY = Math.floor(Math.random() * 70) - 10; // rango en vh
      setPosition({ x: randomX, y: randomY });
    }, 1000); // cada 4 segundos cambia de posición

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Portada */}
      <div className="bg-linear-to-b from-black via-blue-950 to-black w-auto h-svh px-4 py-8 md:py-12 md:px-20 flex-col justify-between relative overflow-hidden md:flex hidden">
        <motion.div
          className="absolute w-150 h-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 15, 250, 0.25) 0%, rgba(12, 10, 100, 0) 70%)",
          }}
          animate={{
            x: `${position.x}vw`,
            y: `${position.y}vh`,
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        />

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
            <img src={logo.src} alt={logo.alt} width={25} height={25} />
          </div>
          <h2 className="text-white font-semibold font-montserrat text-xl">
            Inmobitwo
          </h2>
        </div>

        <div>
          <p className="font-poppins text-white text-3xl md:text-4xl font-semibold">
            La plataforma para inmobiliarias que crecen
          </p>
          <p className="text-gray-400 text-lg md:text-xl mt-2">
            Publica propiedades, conecta con agentes y gestiona tu cartera desde
            un solo lugar.
          </p>
        </div>

        <div className="animate-bounce flex items-center justify-center md:hidden absolute bottom-40 left-1/2 -translate-x-1/2">
          <a
            className="px-4 py-1 rounded-md bg-white text-lg font-semibold text-black hover:bg-white/80 active:scale-[0.99] cursor-pointer select-none flex items-center gap-2 border border-rose-600/10"
            href="#form-login"
          >
            <span>Ingresar</span>
          </a>
        </div>

        <div className="flex items-center justify-between">
          {skills_data.map((skil, i) => {
            return (
              <div key={i}>
                <div>
                  <p className="text-white text-lg md:text-3xl font-semibold font-montserrat text-center md:text-left">
                    {skil.data}
                  </p>
                  <span className="font-poppins text-gray-400 text-sm md:text-base">
                    {skil.texto}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Login */}
      <div className="bg-white w-auto h-svh" id="form-login relative">
        <div className="min-h-screen flex items-center justify-center px-10">
          <div className="w-full max-w-md bg-white rounded-2xl p-2 md:p-8">
            <div className="pb-10">
              <div
                className="flex items-center gap-2 select-none justify-center"
                onClick={() => {
                  navigate("/");
                  irArriba();
                }}
              >
                <div className="w-9 h-9">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="object-center w-full h-full"
                  />
                </div>
                <span className="text-3xl md:text-3xl tracking-tight text-black font-bold">
                  inmobitwo
                </span>
              </div>
              <p className="text-center mt-2">
                Accede a tu cuenta de Inmobitwo
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-2">
              <div>
                <label className="block text-sm font-medium text-black/70 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formDataUsuario.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formDataUsuario.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xl"
                />
              </div>

              <div className="flex items-center justify-end py-2 text-sm">
                <p>¿Olvidaste tu contraseña?</p>
              </div>

              <button
                type="submit"
                disabled={loadingAuth}
                className="hover:bg-black/5 text-black font-medium py-2 rounded-lg transition disabled:opacity-50 border border-black/30 cursor-pointer select-none"
              >
                {loadingAuth ? "Entrando..." : "Entrar"}
              </button>

              <div className="flex items-center justify-between text-xs md:text-base my-2 md:my-0">
                <div className="w-32 h-px bg-black/10" />
                <p>o continúa con</p>
                <div className="w-32 h-px bg-black/10" />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={loadingAuth}
                  className="hover:bg-black/5 text-black font-medium py-2 rounded-lg transition disabled:opacity-50 border border-black/30 cursor-pointer select-none flex items-center justify-center gap-2"
                >
                  <SlSocialGoogle /> <span>Google</span>
                </button>
              </div>
            </form>

            <p className="text-sm text-black/60 mt-4 text-center font-semibold">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-blue-600 hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{scrollbarStyles.default}</style>
    </div>
  );
};

export default Login;
