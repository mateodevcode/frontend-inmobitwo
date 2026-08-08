import { useState } from "react";
import { MdKeyboardArrowDown, MdInfoOutline } from "react-icons/md";

// ─────────────────────────────────────────────
// Subcomponentes reutilizables
// ─────────────────────────────────────────────

const SectionTitle = ({ children }) => (
  <h3 className="font-semibold text-base text-black mb-3">{children}</h3>
);

const SelectField = ({ label, options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none border border-black/20 rounded-sm h-11 px-3 pr-8 text-sm text-black bg-white cursor-pointer focus:outline-none focus:border-tercero"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <MdKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/60 text-lg" />
  </div>
);

const CheckboxItem = ({ id, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 py-1.5 cursor-pointer select-none text-black/80 hover:text-black"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-tercero cursor-pointer"
    />
    <span className="text-sm">{label}</span>
  </label>
);

const RadioItem = ({ id, name, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 py-1.5 cursor-pointer select-none text-black/80 hover:text-black"
  >
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-tercero cursor-pointer"
    />
    <span className="text-sm">{label}</span>
  </label>
);

// Checkbox con sub-lista colapsable (ej: "Pisos, áticos y dúplex")
const CollapsibleCheckboxGroup = ({
  id,
  label,
  checked,
  onChange,
  subItems,
  subValues,
  onSubChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between py-1.5">
        <label
          htmlFor={id}
          className="flex items-center gap-2 cursor-pointer select-none text-black/80 hover:text-black"
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 accent-tercero cursor-pointer"
          />
          <span className="text-sm">{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 cursor-pointer text-black/60 hover:text-black"
        >
          <MdKeyboardArrowDown
            className={`text-lg transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="pl-6 border-l border-black/10 ml-2 mb-1">
          {subItems.map((item) => (
            <CheckboxItem
              key={item}
              id={`${id}-${item}`}
              label={item}
              checked={subValues.includes(item)}
              onChange={() => onSubChange(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

const FormFiltros = () => {
  // Tipo de inmueble
  const [tipoInmueble, setTipoInmueble] = useState("Apartamento");

  // Precio / Tamaño
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [tamanoMin, setTamanoMin] = useState("");
  const [tamanoMax, setTamanoMax] = useState("");

  // Tipo de alquiler
  const [tipoAlquiler, setTipoAlquiler] = useState([]);

  // Tipo de vivienda (con subcategorías)
  const [pisosAticos, setPisosAticos] = useState(false);
  const [pisosAticosSub, setPisosAticosSub] = useState([]);
  const [casasChalets, setCasasChalets] = useState(false);
  const [casasChaletsSub, setCasasChaletsSub] = useState([]);

  // Otras denominaciones
  const [apartamentos, setApartamentos] = useState(false);

  // Equipamiento
  const [equipamiento, setEquipamiento] = useState("");

  // Habitaciones / Baños
  const [habitaciones, setHabitaciones] = useState([]);
  const [banos, setBanos] = useState([]);

  // Estado
  const [estado, setEstado] = useState([]);

  // Características (con Balcón y terraza colapsable)
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [balconTerraza, setBalconTerraza] = useState(false);
  const [balconTerrazaSub, setBalconTerrazaSub] = useState([]);

  // Planta / Eficiencia energética
  const [planta, setPlanta] = useState([]);
  const [eficiencia, setEficiencia] = useState([]);

  // Multimedia / Anunciante
  const [multimedia, setMultimedia] = useState([]);
  const [deBancos, setDeBancos] = useState(false);

  // Fecha de publicación (radio, un solo valor)
  const [fechaPublicacion, setFechaPublicacion] = useState("Indiferente");

  // Helper genérico para togglear un valor dentro de un array de estado
  const toggleValue = (setState) => (value) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto py-5 font-poppins">
      {/* Tipo de inmueble */}
      <div className="mb-6">
        <SectionTitle>Tipo de inmueble</SectionTitle>
        <SelectField
          label="Apartamento"
          value={tipoInmueble}
          onChange={setTipoInmueble}
          options={[
            "Obra nueva",
            "Casa",
            "Habitación",
            "Vacacional",
            "Apartamento",
            "Parqueadero",
            "Oficina",
            "Local comercial",
            "Edificio",
            "Casa campestre",
            "Apartaestudio",
            "Penthouse",
            "Casa lote",
            "Bodega",
            "Consultorio",
            "Lote / Terreno",
            "Finca",
            "Trastero",
          ]}
        />
      </div>

      {/* Precio */}
      <div className="mb-6">
        <SectionTitle>Precio</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <SelectField
            label="Mín"
            value={precioMin}
            onChange={setPrecioMin}
            options={["50.000", "100.000", "150.000", "200.000", "300.000"]}
          />
          <SelectField
            label="Máx"
            value={precioMax}
            onChange={setPrecioMax}
            options={["150.000", "200.000", "300.000", "500.000", "1.000.000"]}
          />
        </div>
      </div>

      {/* Tipo de alquiler */}
      <div className="mb-6">
        <SectionTitle>Tipo de alquiler</SectionTitle>
        <CheckboxItem
          id="alquiler-larga"
          label="Residencial de larga estancia"
          checked={tipoAlquiler.includes("larga")}
          onChange={() => toggleValue(setTipoAlquiler)("larga")}
        />
        <CheckboxItem
          id="alquiler-temporada"
          label="De temporada"
          checked={tipoAlquiler.includes("temporada")}
          onChange={() => toggleValue(setTipoAlquiler)("temporada")}
        />
      </div>

      {/* Tamaño */}
      <div className="mb-6">
        <SectionTitle>Tamaño</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <SelectField
            label="Mín"
            value={tamanoMin}
            onChange={setTamanoMin}
            options={["50 m²", "70 m²", "90 m²", "120 m²", "150 m²"]}
          />
          <SelectField
            label="Máx"
            value={tamanoMax}
            onChange={setTamanoMax}
            options={["90 m²", "120 m²", "150 m²", "200 m²", "300 m²"]}
          />
        </div>
      </div>

      {/* Tipo de vivienda */}
      <div className="mb-6">
        <SectionTitle>Tipo de vivienda</SectionTitle>
        <CollapsibleCheckboxGroup
          id="pisos-aticos"
          label="Pisos, áticos y dúplex"
          checked={pisosAticos}
          onChange={() => setPisosAticos((v) => !v)}
          subItems={["Piso", "Ático", "Dúplex", "Estudio"]}
          subValues={pisosAticosSub}
          onSubChange={toggleValue(setPisosAticosSub)}
        />
        <CollapsibleCheckboxGroup
          id="casas-chalets"
          label="Casas y chalets"
          checked={casasChalets}
          onChange={() => setCasasChalets((v) => !v)}
          subItems={[
            "Casa o chalet independiente",
            "Casa o chalet adosado",
            "Casa o chalet pareado",
            "Finca rústica",
          ]}
          subValues={casasChaletsSub}
          onSubChange={toggleValue(setCasasChaletsSub)}
        />
      </div>

      {/* Otras denominaciones */}
      <div className="mb-6">
        <SectionTitle>Otras denominaciones</SectionTitle>
        <CheckboxItem
          id="apartamentos"
          label="Apartamentos"
          checked={apartamentos}
          onChange={() => setApartamentos((v) => !v)}
        />
      </div>

      {/* Equipamiento */}
      <div className="mb-6">
        <SectionTitle>Equipamiento</SectionTitle>
        <SelectField
          label="Indiferente"
          value={equipamiento}
          onChange={setEquipamiento}
          options={["Amueblado", "Sin amueblar", "Cocina equipada"]}
        />
      </div>

      {/* Habitaciones */}
      <div className="mb-6">
        <SectionTitle>Habitaciones</SectionTitle>
        {[
          "0 habitaciones (estudios)",
          "1",
          "2",
          "3",
          "4 habitaciones o más",
        ].map((label) => (
          <CheckboxItem
            key={label}
            id={`hab-${label}`}
            label={label}
            checked={habitaciones.includes(label)}
            onChange={() => toggleValue(setHabitaciones)(label)}
          />
        ))}
      </div>

      {/* Baños */}
      <div className="mb-6">
        <SectionTitle>Baños</SectionTitle>
        {["1", "2", "3 baños o más"].map((label) => (
          <CheckboxItem
            key={label}
            id={`banos-${label}`}
            label={label}
            checked={banos.includes(label)}
            onChange={() => toggleValue(setBanos)(label)}
          />
        ))}
      </div>

      {/* Estado */}
      <div className="mb-6">
        <SectionTitle>Estado</SectionTitle>
        {["Obra nueva", "Buen estado", "A reformar"].map((label) => (
          <CheckboxItem
            key={label}
            id={`estado-${label}`}
            label={label}
            checked={estado.includes(label)}
            onChange={() => toggleValue(setEstado)(label)}
          />
        ))}
      </div>

      {/* Características */}
      <div className="mb-6">
        <SectionTitle>Características</SectionTitle>
        {[
          "Admite mascotas",
          "Aire acondicionado",
          "Armarios empotrados",
          "Ascensor",
        ].map((label) => (
          <CheckboxItem
            key={label}
            id={`caract-${label}`}
            label={label}
            checked={caracteristicas.includes(label)}
            onChange={() => toggleValue(setCaracteristicas)(label)}
          />
        ))}

        <CollapsibleCheckboxGroup
          id="balcon-terraza"
          label="Balcón y terraza"
          checked={balconTerraza}
          onChange={() => setBalconTerraza((v) => !v)}
          subItems={["Balcón", "Terraza"]}
          subValues={balconTerrazaSub}
          onSubChange={toggleValue(setBalconTerrazaSub)}
        />

        {[
          "Exterior",
          "Garaje",
          "Jardín",
          "Piscina",
          "Trastero",
          "Vivienda accesible",
          "Vivienda de lujo",
        ].map((label) => (
          <CheckboxItem
            key={label}
            id={`caract-${label}`}
            label={label}
            checked={caracteristicas.includes(label)}
            onChange={() => toggleValue(setCaracteristicas)(label)}
          />
        ))}
      </div>

      {/* Planta */}
      <div className="mb-6">
        <SectionTitle>Planta</SectionTitle>
        {["Última planta", "Plantas intermedias", "Bajos"].map((label) => (
          <CheckboxItem
            key={label}
            id={`planta-${label}`}
            label={label}
            checked={planta.includes(label)}
            onChange={() => toggleValue(setPlanta)(label)}
          />
        ))}
      </div>

      {/* Eficiencia energética */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="font-semibold text-base text-black">
            Eficiencia energética
          </h3>
          <MdInfoOutline className="text-blue-600 text-base" />
        </div>
        {["Alta", "Media", "Baja"].map((label) => (
          <CheckboxItem
            key={label}
            id={`eficiencia-${label}`}
            label={label}
            checked={eficiencia.includes(label)}
            onChange={() => toggleValue(setEficiencia)(label)}
          />
        ))}
      </div>

      {/* Multimedia */}
      <div className="mb-6">
        <SectionTitle>Multimedia</SectionTitle>
        {["Con plano", "Con visita virtual"].map((label) => (
          <CheckboxItem
            key={label}
            id={`multimedia-${label}`}
            label={label}
            checked={multimedia.includes(label)}
            onChange={() => toggleValue(setMultimedia)(label)}
          />
        ))}
      </div>

      {/* Tipo de anunciante */}
      <div className="mb-6">
        <SectionTitle>Tipo de anunciante</SectionTitle>
        <CheckboxItem
          id="de-bancos"
          label="De bancos"
          checked={deBancos}
          onChange={() => setDeBancos((v) => !v)}
        />
      </div>

      {/* Fecha de publicación */}
      <div className="mb-2">
        <SectionTitle>Fecha de publicación</SectionTitle>
        {[
          "Indiferente",
          "Últimas 24 horas",
          "La última semana",
          "El último mes",
        ].map((label) => (
          <RadioItem
            key={label}
            id={`fecha-${label}`}
            name="fecha-publicacion"
            label={label}
            checked={fechaPublicacion === label}
            onChange={() => setFechaPublicacion(label)}
          />
        ))}
      </div>
    </div>
  );
};

export default FormFiltros;
