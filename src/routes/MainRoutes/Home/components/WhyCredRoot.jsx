import {
  FiCheckSquare,
  FiClock,
  FiMaximize2,
  FiMessageSquare,
} from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import whyImage from "../../../../assets/home/whycredroot/why-credroot.svg";

export default function WhyCredRoot() {
  const features = [
    {
      icon: <FiCheckSquare />,
      title: "Right selection of lenders from multiple options",
    },
    {
      icon: <FiClock />,
      title: "Shorten the process of sanction and disbursement",
    },
    {
      icon: <FiMaximize2 />,
      title: "Maximum reach to the real need of businesses",
    },
    {
      icon: <FiMessageSquare />,
      title: "Expert advice on real time basis through tech-based platforms",
    },
    {
      icon: <HiOutlineBadgeCheck />,
      title: "Competitive offers from lenders",
    },
  ];

  return (
    <section className="bg-[#f8f9fc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-[36px] md:text-[48px] font-semibold leading-tight">
            <span className="text-[#111827]">Why Cred</span>
            <span className="text-[#1E88FF]">Root</span>
            <span className="text-[#111827]">?</span>
          </h2>

          <p className="mt-6 text-[#6B7280] text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto">
            Why choose CredRoot for your financial needs? Here are a list of
            perfect reasons for making CredRoot your preferred choice
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src={whyImage}
              alt="Why CredRoot"
              className="w-full max-w-[550px] object-contain"
            />
          </div>

          {/* Right Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-[34px] text-primary mb-5">
                  {item.icon}
                </div>

                <h3 className="text-[18px] text-[#1F2937] leading-relaxed font-medium">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}