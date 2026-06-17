import { Link } from "react-router-dom";
import faqBg from "../../../../assets/home/faq/cta-bg.jpg";

export default function FAQBanner() {
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        backgroundImage: `url(${faqBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#16376A]/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[52px] font-light text-[#1E88FF]">
            F.A.Q.
          </h2>

          <div className="flex items-center justify-center mt-4">
            <div className="w-24 h-[1px] bg-white/30" />
            <div className="w-12 h-[3px] bg-[#1E88FF]" />
            <div className="w-24 h-[1px] bg-white/30" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-[900px] text-center lg:text-left">
            <p className="text-white text-[24px] leading-relaxed">
              Have any questions? You can read through the list of frequently
              asked questions and their detailed answers that might help clarify
              your doubts and concerns
            </p>
          </div>

          <Link
            to="/faqs"
            className="
              border-2 border-white
              text-white
              px-12 py-5
              rounded-md
              text-[24px]
              font-medium
              hover:bg-white
              hover:text-[#16376A]
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Read F.A.Q.s
          </Link>
        </div>
      </div>
    </section>
  );
}