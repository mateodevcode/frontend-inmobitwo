import RadioGroupInput from "../../components/RadioGroupInput";
import { RENTAL_TYPE_OPTIONS } from "@/data/rental_type_options";

const TipoAlquiler = ({ value, onChange }) => {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold text-slate-900">
        Tipo de alquiler
      </h2>
      <a
        href="#"
        className="mb-2 inline-block text-base text-blue-600 hover:underline"
      >
        Más información sobre tipos de alquiler
      </a>
      <RadioGroupInput options={RENTAL_TYPE_OPTIONS} value={value} onChange={onChange} />
    </div>
  );
};

export default TipoAlquiler;
