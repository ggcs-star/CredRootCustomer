import React, { useEffect } from 'react';
import HeroSlider from './components/HeroSlider';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import FAQBanner from './components/FAQBanner';
import WhyCredRoot from './components/WhyCredRoot';
import ProductsSlider from './components/ProductsSlider';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <section id="home">
        <HeroSlider />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="why-credroot">
        <WhyCredRoot />
      </section>

      <section id="products">
        <ProductsSlider />
      </section>

      <section id="faqs">
        <FAQBanner />
      </section>

      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
};

export default Home;