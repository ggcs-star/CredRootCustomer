import { useEffect, useState } from "react";
import aboutBg from "../../../../assets/home/aboutus/about-us-pattern.jpg";
import aboutIllustration from "../../../../assets/home/aboutus/about-us.svg";

export default function AboutSection() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.25);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f8f9fc] py-16 lg:py-24">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "100px",
          backgroundPosition: "center",
          transform: `translateY(${offsetY}px)`,
          willChange: "transform",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Illustration */}
            <div className="flex justify-center">
              <img
                src={aboutIllustration}
                alt="About CredRoot"
                className="w-full max-w-[500px] lg:max-w-[550px] object-contain"
              />
            </div>

            {/* Right Content */}
            <div>
              <h2 className="text-[36px] md:text-[42px] lg:text-[52px] font-semibold leading-tight mb-8">
                <span className="text-[#111827]">About </span>
                <span className="text-primary">Us</span>
              </h2>

              <p className="text-[#4B5563] text-[16px] md:text-[18px] leading-[1.9] mb-8">
                CredRoot is a tech-enabled platform that facilitates MSMEs,
                retailers, distributors and large enterprises to access
                affordable credit directly from lenders. This makes easier to
                reach goals of fund raising with customized tools and solutions,
                designed to meet monetary needs of businesses.
              </p>

              <p className="text-[#4B5563] text-[16px] md:text-[18px] leading-[1.9]">
                Financial inclusion will only be possible through connecting
                every layer of services through technology. Keeping in this
                mind, tech based platforms has been created to help clients on
                various aspects of debt raising and giving competitive
                advantages on selection from multiple options.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}