// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <h1 className="text-6xl font-bold text-gray-200">404</h1>
    <p className="text-gray-500">Página no encontrada.</p>
    <Link to="/" className="text-blue-600 hover:underline text-sm">
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
