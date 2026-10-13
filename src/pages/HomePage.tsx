import { Hero } from "../components/layout/hero/Hero";
import { CatalogSection } from "../components/layout/products/CatalogSection";
import PromoSection from "../components/layout/promo/PromoSection";
import BlogSection from "../components/layout/blog/BlogSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <CatalogSection />
      <PromoSection />
      <BlogSection />
    </>
  );
}

export default HomePage;