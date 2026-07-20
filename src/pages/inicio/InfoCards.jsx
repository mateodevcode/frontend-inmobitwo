import { useNavigate } from "react-router-dom";
import { cards } from "@/data/infocards";
import { irArriba } from "@/utils/irArriba";

const InfoCards = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex justify-center font-poppins py-5 md:py-10">
      <div className="w-11/12 md:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-stretch gap-5 border border-black/10"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-28 h-28 md:w-32 md:h-32 object-cover shrink-0"
            />

            <div className="flex flex-col justify-center">
              <h3 className="text-black font-semibold text-sm md:text-base mb-1">
                {card.title}
              </h3>
              <p className="text-black/60 text-xs md:text-sm leading-snug mb-2">
                {card.description}
              </p>
              <button
                onClick={() => {
                  navigate(card.linkUrl);
                  irArriba();
                }}
                className="text-sky-700 text-xs md:text-sm font-medium hover:underline w-fit"
              >
                {card.linkLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
