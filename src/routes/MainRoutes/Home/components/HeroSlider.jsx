import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaPlay } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

import slide1Img from "../../../../assets/home/herosection/slide1.svg";
import slide2Img from "../../../../assets/home/herosection/slide2.svg";
import slide3Img from "../../../../assets/home/herosection/slide3.svg";
import slide4Img from "../../../../assets/home/herosection/slide4.svg";

const slides = [
  {
    title: "A Place for Inclusiveness",
    description:
      "As at CredRoot, one can get multiple lending options without any additional efforts to all who deserves finance for business.",
    image: slide1Img,
  },
  {
    title: "Fund raising platform for MSME",
    description:
      "Every MSME unit has distinguish modes operandi, CredRoot understands the same & hence have lender options according to industry & segment of the applicant.",
    image: slide2Img,
  },
  {
    title: "Multiple lenders at one Place",
    description:
      "Simply, Single efforts for multiple options, that makes CredRoot different from traditional process and platforms.",
    image: slide3Img,
  },
  {
    title: "Confirmation or Nothing / A Clarity with Technology",
    description:
      "Before a single meeting with Lender, customer gets confirmation from lending institution on funding offers.",
    image: slide4Img,
  },
];

export default function HeroSlider() {
  return (
    <section className="bg-[#f3f3f3]">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide, index) => {
          const reverse = index % 2 !== 0;

          return (
            <SwiperSlide key={index}>
              <div className="max-w-7xl mx-auto px-6">
                <div
                  className={`min-h-[85vh] grid lg:grid-cols-2 gap-16 items-center ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Content */}
                  <div>
                    <h1 className="text-[40px] font-bold text-[#111] leading-tight">
                      {slide.title}
                    </h1>

                    <p className="mt-6 text-[20px] text-gray-600 leading-relaxed max-w-[650px]">
                      {slide.description}
                    </p>

                    <div className="mt-12 flex flex-wrap items-center gap-8">
                      <button
                        className="
                          bg-[#1E88FF]
                          text-white
                          px-10
                          py-4
                          rounded-full
                          font-semibold
                          text-lg
                          hover:bg-[#1677f2]
                          transition
                        "
                      >
                        Get Started
                      </button>

                      <button className="flex items-center gap-3 text-[#222]">
                        <span
                          className="
                            w-12 h-12
                            border-2
                            border-black
                            rounded-full
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaPlay className="text-sm ml-1" />
                        </span>

                        <span className="text-[24px]">
                          Watch Video
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="
                        w-full
                        max-w-[650px]
                        object-contain
                      "
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}