import Slider from "react-slick";
import {
  Building2,
  ShieldCheck,
  Handshake,
  HardHat,
} from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Images
import product1 from "../../../../assets/home/products/product1.png";
import product2 from "../../../../assets/home/products/product2.png";
import product3 from "../../../../assets/home/products/product3.png";
import product4 from "../../../../assets/home/products/product4.png";

const products = [
  {
    id: 1,
    image: product1,
    icon: Building2,
    iconBg: "bg-blue-600",
    title: "Collateral backed Loans for MSME",
    subtitle: "ROI ranges from 9.50% to 11%",
    description:
      "If applicant has property to give, ideally should take collateral backed loans as cost of funds is always lower in secured loans compared to unsecured collateral-free loans.",
  },
  {
    id: 2,
    image: product2,
    icon: ShieldCheck,
    iconBg: "bg-green-500",
    title: "Collateral Free Loans for MSME",
    subtitle: "Govt guarantee backed loans up to Rs. 5 Crores",
    description:
      "ROI ranges from 10% to 13%. If you're running a business for more than three years and don't have collateral, collateral-free funding is available.",
  },
  {
    id: 3,
    image: product3,
    icon: Handshake,
    iconBg: "bg-purple-500",
    title: "Hybrid Loans",
    subtitle: "",
    description:
      "If you are short of collateral against the funding amount required, hybrid loans combine secured and unsecured exposure for flexible financing.",
  },
  {
    id: 4,
    image: product4,
    icon: HardHat,
    iconBg: "bg-orange-500",
    title: "Project Finance - Green Field or Brown Field",
    subtitle: "",
    description:
      "Creditflow supports project financing for Greenfield and Brownfield projects with flexible funding solutions for different business requirements.",
  },
];

export default function ProductSlider() {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[54px] font-light text-[#111]">
            Products
          </h2>
        </div>

        <Slider {...settings}>
          {products.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="px-3 h-full">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-visible">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Floating Icon */}
                    <div
                      className={`absolute -bottom-5 left-5 w-12 h-12 rounded-full ${item.iconBg} border-4 border-white flex items-center justify-center shadow-lg z-10`}
                    >
                      <Icon className="text-white" size={22} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-8 pb-6 px-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 leading-6 min-h-[52px]">
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="text-[#1E88FF] font-semibold text-sm mt-2">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm leading-6 mt-3 flex-1">
                      {item.description}
                    </p>

                    <button className="mt-5 flex items-center gap-2 text-[#1E88FF] font-semibold hover:text-blue-700 transition-all group">
                      Know More
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slick-slide {
          padding-bottom: 10px;
        }

        .slick-track {
          display: flex !important;
        }

        .slick-slide {
          height: inherit !important;
        }

        .slick-slide > div {
          height: 100%;
        }

        .slick-prev,
        .slick-next {
          z-index: 10;
        }

        .slick-prev {
          left: -45px;
        }

        .slick-next {
          right: -45px;
        }

        .slick-prev:before,
        .slick-next:before {
          color: #1e88ff;
          font-size: 28px;
        }

        .slick-dots {
          bottom: -45px;
        }

        .slick-dots li button:before {
          color: #1e88ff;
          font-size: 12px;
        }

        .slick-dots li.slick-active button:before {
          color: #1e88ff;
        }
      `}</style>
    </section>
  );
}