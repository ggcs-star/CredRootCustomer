import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import slide1 from "../../../../assets/home/product/product1.svg";
import slide2 from "../../../../assets/home/product/product2.svg";
import slide3 from "../../../../assets/home/product/product3.svg";
import slide4 from "../../../../assets/home/product/product4.svg";

const products = [
  {
    image: slide1,
    title: "Collateral backed Loans for MSME",
    roi: "ROI ranges from 9.50% to 11%",
    description:
      "If applicant has property to give, ideally he/she should take collateral backed loans as costs of fund is always lower in secured loans as compared to unsecured/collateral free loans.",
  },
  {
    image: slide2,
    title: "Collateral Free Loans for MSME",
    roi: "Govt guarantee backed loans up to Rs. 5 Crores",
    description:
      "ROI ranges from 10% to 13%. Not to worry, if you are running businesses for more than three years and don't have collaterals to offer for loans. You can arrange a loan without collaterals under various government guarantee backed funding schemes through CredRoot platform.",
  },
  {
    image: slide3,
    title: "Hybrid Loans",
    roi: "",
    description:
      "Not to worry, if you are short of properties against funding amount you want in your business, you can arrange funding mixed of collaterals and no-collateral backed exposure, which will help you to reduce cost of funds to the extent possible.",
  },
  {
    image: slide4,
    title: "Project Finance - Green Field or Brown Field",
    roi: "",
    description:
      "CredRoot supports any sort of loan requirement. Dynamism and matrix of CredRoot build very flexible to support any kind of fund raising for variety of businesses.",
  },
];

export default function ProductsSlider() {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Common Heading */}
        <div className="text-center mb-16">
          <h2 className="text-[54px] font-light text-[#111]">
            Products
          </h2>

          <div className="flex items-center justify-center mt-4">
            <div className="w-20 h-[1px] bg-gray-300"></div>
            <div className="w-10 h-[3px] bg-[#1E88FF]"></div>
            <div className="w-20 h-[1px] bg-gray-300"></div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop
          className="products-swiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">

                {/* Left Content */}
                <div className="max-w-[700px]">
                  <h3 className="text-[42px] font-bold text-[#111] leading-tight">
                    {product.title}
                  </h3>

                  {product.roi && (
                    <p className="mt-4 text-[20px] font-semibold text-[#1E88FF]">
                      {product.roi}
                    </p>
                  )}

                  <div className="mt-6 flex">
                    <span className="text-green-600 text-2xl mr-3">✓</span>

                    <p className="text-[20px] leading-relaxed text-[#333]">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Right Image */}
                <div className="flex justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full max-w-[550px] object-contain"
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}