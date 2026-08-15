import { useAppContext } from "@/context/AppContext";
import { getInitials } from "@/lib/getInitials";
import { getColorForOrg } from "@/lib/getRandomTailwindColors";
import { formatFirstTwoNames } from "@/lib/formatFirstTwoNames";
import { getUsernameFromEmail } from "@/lib/getUsernameFromEmail";

const TAMANOS = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-10 h-10 text-base",
};

const BotonUsuario = ({
  onClick,
  tamano = "md",
  mostrarNombre = false,
  className = "",
}) => {
  const { usuario } = useAppContext();
  if (!usuario) return null;

  const { name, email } = usuario;
  const color = getColorForOrg(usuario.id, name);
  const sizeClass = TAMANOS[tamano] || TAMANOS.md;

  const avatar = usuario.image_url ? (
    <img
      src={usuario.image_url}
      alt={name}
      className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm shrink-0`}
    />
  ) : (
    <div
      className={`${sizeClass} p-4 rounded-full font-semibold flex items-center justify-center hover:shadow shadow-black/10 active:scale-95 duration-75 transition shrink-0`}
      style={color}
    >
      {getInitials(name)}
    </div>
  );

  return (
    <div
      className={`md:flex gap-2 items-center relative cursor-pointer select-none hidden ${className}`}
      onClick={onClick}
    >
      <div className="hover:bg-segundo/5 absolute inset-0 rounded-full z-20" />
      {avatar}
      {mostrarNombre && (
        <div className="flex flex-col">
          <p className="font-semibold text-black text-sm">
            {formatFirstTwoNames(name)}
          </p>
          <p className="text-xs -mt-1">{getUsernameFromEmail(email)}</p>
        </div>
      )}
    </div>
  );
};

export default BotonUsuario;
