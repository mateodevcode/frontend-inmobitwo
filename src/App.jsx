// src/App.jsx
import "./App.css";
import { useTenant } from "@/context/TenantContext.js";
import AppRouter from "@/router/AppRouter.jsx";

function App() {
  const { cargandoTenant } = useTenant();

  // Mientras se resuelve si este host es la red social o el dominio
  // propio de una organización, no montamos el router todavía.
  if (cargandoTenant) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="relative">
      <AppRouter />
    </div>
  );
}

export default App;
