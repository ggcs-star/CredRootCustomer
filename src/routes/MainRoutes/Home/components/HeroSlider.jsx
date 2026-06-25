import { FaPlay } from "react-icons/fa";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

// Import your hero image
import heroImage from "../../../../assets/home/herosection/hero-banner.png";

export default function HeroSlider() {
  return (
    <section className="relative bg-[#f3f3f3] min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <img
          src={heroImage}
          alt="CredRoot Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/80 z-1"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh] py-12">
          {/* Left Content */}
          <div className="text-black">
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-tight">
              A Place for <br className="hidden sm:block" />
              <span className="text-[#1E88FF]">Inclusiveness</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-[20px] text-black leading-relaxed max-w-[650px]">
              As at CredRoot, one can get multiple lending options without any 
              additional efforts to all who deserves finance for business.
            </p>

            {/* Buttons */}
      <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-8">
  <button
    className="
      bg-[#1E88FF]
      text-white
      px-8 sm:px-12
      py-3 sm:py-4
      rounded-xl
      font-semibold
      text-base sm:text-lg
      hover:bg-[#1677f2]
      transition
      shadow-lg
      hover:shadow-xl
      h-[52px] sm:h-[60px]
      flex items-center
    "
  >
    Get Started
  </button>

  <button className="flex items-center gap-3 text-black hover:text-[#1E88FF] transition group border-2 border-black hover:border-[#1E88FF] rounded-xl px-4 sm:px-6 h-[52px] sm:h-[60px]">
    <span
      className="
        w-10 h-10
        border-2
        border-white
        rounded-full
        flex
        items-center
        justify-center
        group-hover:border-[#1E88FF]
        transition
        flex-shrink-0
      "
    >
      <FaPlay className="text-xs ml-1" />
    </span>

    <span className="text-base sm:text-[20px] font-medium whitespace-nowrap">
      Watch Video
    </span>
  </button>
</div>

            {/* Feature Tags */}
            {/* <div className="mt-10 sm:mt-16 flex flex-wrap gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1E88FF] rounded-full"></div>
                <span className="text-white/90 text-sm sm:text-base font-medium">
                  Multiple Lenders Options
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1E88FF] rounded-full"></div>
                <span className="text-white/90 text-sm sm:text-base font-medium">
                  Competitive Interest Rates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1E88FF] rounded-full"></div>
                <span className="text-white/90 text-sm sm:text-base font-medium">
                  Faster Approval
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1E88FF] rounded-full"></div>
                <span className="text-white/90 text-sm sm:text-base font-medium">
                  End-to-end Support
                </span>
              </div>
            </div> */}
          </div>

          {/* Right Content - Empty for now */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

     
    </section>
  );
}