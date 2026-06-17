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
    <section className="relative overflow-hidden bg-[#f4f4f4] py-20">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0 opacity-80"
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
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 items-center min-h-[750px] gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[48px] md:text-[64px] font-light leading-none">
              <span className="text-[#111111]">About </span>
              <span className="text-[#1E88FF] font-normal">Us</span>
            </h2>

            <div className="mt-8 max-w-[650px]">
              <p className="text-[20px] md:text-[22px] leading-[1.7] text-[#2f2f2f]">
                CredRoot is a tech-enabled platform that facilitates MSMEs,
                retailers, distributors and large enterprises to access
                affordable credit directly from lenders. This makes easier to
                reach goals of fund raising with customized tools and solutions,
                designed to meet monetary needs of businesses.
              </p>

              <p className="mt-10 text-[20px] md:text-[22px] leading-[1.7] text-[#2f2f2f]">
                Financial inclusion will only be possible through connecting
                every layer of services through technology. Keeping in this
                mind, tech based platforms has been created to help clients on
                various aspects of debt raising and giving competitive
                advantages on selection from multiple options.
              </p>

              {/* Blue Accent Line */}
              <div className="flex justify-center mt-12">
                <div className="w-[180px] h-[8px] rounded-full bg-[#1E88FF]" />
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={aboutIllustration}
              alt="About CredRoot"
              className="w-full max-w-[700px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}