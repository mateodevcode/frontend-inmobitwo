import { Link } from "react-router-dom";
import Logo from "@/components/logo/Logo.jsx";

export function LogoLink({ className }) {
  return (
    <Link to="/" className={className} aria-label="Ir al inicio de inmobitwo">
      <Logo />
    </Link>
  );
}
