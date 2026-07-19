import TopHeader from "./TopHeader";
import Header from "./Header";
import Hero from "./Hero";
import PropertySearchWidget from "./PropertySearchWidget";
import PropertyGrid from "./PropertyGrid";
import ScrollToTop from "./ScrollToTop";
import WhyChooseUs from "./WhyChooseUs";
import MarketProperty from "./MarketProperty";
import ExploreNeighborhoods from "./ExploreNeighborhoods";
import MeetOurAgents from "./MeetOurAgents";
import ClientTestimonials from "./ClientTestimonials";
import FooterSection from "./FooterSection";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1706164971293-2d58eb66242b?fm=jpg&q=80&w=2400&auto=format&fit=crop";

const Home = () => {
  return (
    <div className="m-h-svh">
      <div className="relative">
        <div
          className="relative h-full bg-cover bg-center flex flex-col bg-amber-300"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#0b0f16] via-[#0b0f16]/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/30" />
          <TopHeader />
          <Header />
          <Hero />
        </div>
        <div className="bg-white">
          <PropertySearchWidget />
        </div>
      </div>

      <PropertyGrid />
      <WhyChooseUs />
      <MarketProperty />
      <ExploreNeighborhoods />
      <MeetOurAgents />
      <ClientTestimonials />
      <FooterSection />

      <ScrollToTop />
    </div>
  );
};

export default Home;
