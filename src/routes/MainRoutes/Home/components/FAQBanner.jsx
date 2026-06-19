import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { BiMessageDetail } from "react-icons/bi";
import faqBg from "../../../../assets/home/faq/cta-bg.jpg";

export default function FAQBanner() {
  return (
    <section
      className="relative overflow-hidden h-[180px] lg:h-[170px]"
      style={{
        backgroundImage: `url(${faqBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#03245F]/90" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6">
        <div className="h-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          
          {/* Left Section */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-primary">
              <BiMessageDetail size={70} />
            </div>

            <h2 className="text-white text-3xl lg:text-[38px] font-semibold">
              F.A.Q.
            </h2>
          </div>

          {/* Center Text */}
          <div className="flex-1 max-w-[550px] text-center lg:text-left">
            <p className="text-white text-sm md:text-base leading-7">
              Have any questions? You can read through the list of
              frequently asked questions and their detailed answers
              that might help clarify your doubts and concerns.
            </p>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <Link
              to="/faqs"
              className="
                bg-white
                text-primary
                px-8
                py-4
                rounded-lg
                flex
                items-center
                gap-3
                font-semibold
                whitespace-nowrap
                hover:bg-gray-100
                transition-all
                duration-300
                shadow-md
              "
            >
              Read F.A.Q.s
              <FiArrowRight size={20} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}