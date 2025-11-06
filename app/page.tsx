import DiscoverSection from "@/components/home/discover";
import HeroSection from "@/components/home/hero";
import CategoriesSection from "@/components/home/categories";
import CtaBanner from "@/components/home/cta-banner";
import SiteFooter from "@/components/layout/footer";

const Homepage = () => {
  return (
    <main className="">
      <HeroSection />
      <DiscoverSection />
      <CategoriesSection />
      <CtaBanner />
      <SiteFooter />
    </main>
  );
};

export default Homepage;
