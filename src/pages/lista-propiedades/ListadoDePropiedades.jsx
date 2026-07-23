import FiltroRelevante from "./FiltroRelevante";
import CardAnuncio from "./CardAnuncio";

const ListadoDePropiedades = () => {
  const anuncios = [1, 2, 3];

  return (
    <div className="w-[75%] h-full">
      <FiltroRelevante />
      <div className="flex flex-col gap-4 p-4">
        {anuncios.map((anu) => {
          return <CardAnuncio anu={anu} key={anu} />;
        })}
      </div>
    </div>
  );
};

export default ListadoDePropiedades;
