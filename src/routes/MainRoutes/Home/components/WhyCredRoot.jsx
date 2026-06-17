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
    <section className="bg-[#f5f5f5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Illustration */}
          <div className="flex justify-center">
            <img
              src={whyImage}
              alt="Why CredRoot"
              className="w-full max-w-[700px] object-contain"
            />
          </div>

          {/* Right Content */}
          <div>
            {/* Heading */}
            <div className="text-center lg:text-center">
              <h2 className="text-[48px] font-light leading-none">
                <span className="text-[#111111]">Why Cred</span>
                <span className="text-[#1E88FF] font-normal">Root</span>
                <span className="text-[#111111]">?</span>
              </h2>

              <div className="flex items-center justify-center mt-6">
                <div className="w-20 h-[1px] bg-gray-300" />
                <div className="w-10 h-[3px] bg-[#1E88FF]" />
                <div className="w-20 h-[1px] bg-gray-300" />
              </div>

              <p className="mt-8 text-[20px] text-gray-700 leading-relaxed max-w-[700px] mx-auto">
                Why choose CredRoot for your financial needs? Here are a list of
                perfect reasons for making CredRoot your preferred choice
              </p>
            </div>

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-14">
              {features.map((item, index) => (
                <div key={index}>
                  <div className="text-[34px] text-[#1f1f1f] mb-4">
                    {item.icon}
                  </div>

                  <h3 className="text-[20px] font-semibold text-[#222] leading-snug">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}