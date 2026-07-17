import Navbar from "./Navbar";
import TopHeader from "./TopHeader";
import Hero from "./Hero";
import ScrollToTop from "./ScrollToTop";
import PropertySlider from "./PropertySlider";
import PropertyGrid from "./PropertyGrid";
import PillarHelpSection from "./PillarHelpSection";
import AgentsSlider from "./AgentsSlider";
import NeighborhoodsSection from "./NeighborhoodsSection";
import DownloadAppSection from "./DownloadAppSection";
import FeaturedPropertyHero from "./FeaturedPropertyHero";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import GetInTouchSection from "./GetInTouchSection";
import FooterSection from "./FooterSection";

const Home = () => {
  return (
    <div className="relative">
      <TopHeader />
      <Navbar />
      <Hero />
      <PropertySlider />
      <PropertyGrid />
      <PillarHelpSection />
      <AgentsSlider />
      <NeighborhoodsSection />
      <DownloadAppSection />
      <FeaturedPropertyHero />
      <TestimonialsSection />
      <FAQSection />
      <GetInTouchSection />
      <FooterSection />

      <ScrollToTop />
    </div>
  );
};

export default Home;
