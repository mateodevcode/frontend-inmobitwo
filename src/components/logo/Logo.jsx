import { useNavigate } from "react-router-dom";
import { irArriba } from "../../utils/irArriba";
import { logo } from "@/data/logo";

function Logo() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2 select-none cursor-pointer"
      onClick={() => {
        navigate("/");
        irArriba();
      }}
    >
      <div className="w-7 h-7">
        <img
          src={logo.src}
          alt={logo.alt}
          className="object-center w-full h-full"
        />
      </div>
      <span className="text-2xl tracking-tight text-black font-semibold">
        inmobitwo
      </span>
    </div>
  );
}

export default Logo;
